import { NextRequest } from "next/server";
import { z } from "zod";
import { buildPrompt } from "@/lib/ai/prompt";
import { signatureSchema, txAiResultSchema, type TxAIResult } from "@/lib/ai/schemas";
import { getFacts } from "@/lib/solana/parseTxFacts";
import { streamSummary } from "@/lib/ai/stream";
import { NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { x402Facilitator, x402Network, x402PayTo, x402Paywall } from "@/lib/x402";

const inputSchema = z.object({
  signature: signatureSchema,
  mode: z.enum(["basic", "tax"]).default("basic")
});

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

async function handler(req: NextRequest): Promise<NextResponse<unknown>> {
  const body = await req.json().catch(() => ({}));
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(sse({ type: "error", error: "invalid payload" }), {
      status: 400,
      headers: { "content-type": "text/event-stream" }
    });
  }

  const { signature, mode } = parsed.data;
  const facts = await getFacts(signature);

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(new TextEncoder().encode(sse({ type: "facts", facts })));
      let summary = "";

      await streamSummary(buildPrompt(facts, mode), (chunk) => {
        summary += chunk;
        controller.enqueue(new TextEncoder().encode(sse({ type: "summary", chunk })));
      });

      const result: TxAIResult = {
        facts,
        summary: summary || "No summary generated.",
        category: "unknown",
        tags: facts.programs.map((p) => p.label || p.programId),
        userActions: [{ action: "Inspect wallet movements", details: "Double-check inferred transfers." }],
        confidence: Math.max(0, Math.min(1, 0.6 - (facts.warnings.includes("missing meta") ? 0.2 : 0))),
        warnings: facts.warnings,
        ...(mode === "tax"
          ? {
              tax: {
                rows: [
                  {
                    timestamp: facts.blockTime ? new Date(facts.blockTime * 1000).toISOString() : new Date().toISOString(),
                    proceeds: "0",
                    fee: String(facts.feeLamports),
                    notes: "Streamed placeholder"
                  }
                ]
              }
            }
          : {})
      };

      const validated = txAiResultSchema.parse(result);
      controller.enqueue(new TextEncoder().encode(sse({ type: "final", result: validated })));
      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive"
    }
  });
}

export const POST = withX402(
  handler,
  x402PayTo(),
  {
    price: "$0.05",
    network: x402Network(),
    config: { description: "Solana tx explanation streamed endpoint" }
  },
  x402Facilitator(),
  x402Paywall()
);
