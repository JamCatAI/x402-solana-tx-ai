import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { cacheGet, cacheSet } from "@/lib/cache/redis";
import { cacheKeys } from "@/lib/cache/keys";
import { buildPrompt } from "@/lib/ai/prompt";
import { signatureSchema, txAiResultSchema } from "@/lib/ai/schemas";
import { getFacts } from "@/lib/solana/parseTxFacts";
import { getRequestId } from "@/lib/utils";
import { withX402 } from "x402-next";
import { x402Facilitator, x402Network, x402PayTo, x402Paywall } from "@/lib/x402";

const inputSchema = z.object({
  signature: signatureSchema,
  mode: z.enum(["basic", "tax"]).default("basic")
});

const TTL = 60 * 60 * 24;
const MODEL_VERSION = "gpt-4.1-mini-v1";

function heuristicConfidence(warnings: string[], programCount: number) {
  let confidence = 0.5;
  if (programCount > 0) confidence += 0.1;
  if (warnings.includes("missing meta")) confidence -= 0.2;
  if (warnings.includes("parsed fallback")) confidence -= 0.1;
  return Math.max(0, Math.min(1, confidence));
}

async function handler(req: NextRequest): Promise<NextResponse<unknown>> {
  const requestId = getRequestId();
  const body = await req.json().catch(() => ({}));
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload", requestId }, { status: 400 });
  }

  const { signature, mode } = parsed.data;
  const network = process.env.NEXT_PUBLIC_NETWORK || "solana-devnet";
  const aiKey = cacheKeys.ai(network, signature, mode, MODEL_VERSION);
  const cached = await cacheGet(aiKey);
  if (cached) {
    return NextResponse.json({ result: cached, requestId, cached: true });
  }

  const facts = await getFacts(signature);
  const confidence = heuristicConfidence(facts.warnings, facts.programs.length);

  let modelJson = {
    facts,
    summary: facts.success ? "Transaction executed successfully." : "Transaction failed or has incomplete metadata.",
    category: "unknown" as const,
    tags: facts.programs.map((p) => p.label || p.programId),
    userActions: [{ action: "Review details", details: "Confirm sender/recipient and token deltas." }],
    confidence,
    warnings: facts.warnings,
    ...(mode === "tax"
      ? {
          tax: {
            rows: [
              {
                timestamp: facts.blockTime ? new Date(facts.blockTime * 1000).toISOString() : new Date().toISOString(),
                proceeds: "0",
                fee: String(facts.feeLamports),
                notes: "Auto-generated tax placeholder"
              }
            ]
          }
        }
      : {})
  };

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildPrompt(facts, mode);
    const response = await client.responses.create({ model: "gpt-4.1-mini", input: prompt });
    const raw = response.output_text || "";
    try {
      modelJson = JSON.parse(raw);
    } catch {
      // Keep fallback if model output is malformed.
    }
  }

  const validated = txAiResultSchema.safeParse(modelJson);
  if (!validated.success) {
    return NextResponse.json({ error: "model_output_invalid", requestId, issues: validated.error.issues }, { status: 502 });
  }

  await cacheSet(aiKey, validated.data, TTL);
  return NextResponse.json({ result: validated.data, requestId, cached: false });
}

export const POST = withX402(
  handler,
  x402PayTo(),
  {
    price: "$0.03",
    network: x402Network(),
    config: { description: "Solana tx explanation JSON endpoint" }
  },
  x402Facilitator(),
  x402Paywall()
);
