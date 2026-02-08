import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache/redis";
import { cacheKeys } from "@/lib/cache/keys";
import { signatureSchema } from "@/lib/ai/schemas";
import { getFacts } from "@/lib/solana/parseTxFacts";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp, getRequestId } from "@/lib/utils";

const TTL = 60 * 60 * 24;

export async function POST(req: NextRequest) {
  const requestId = getRequestId();
  const ip = getClientIp(req);
  const limiter = rateLimit({ key: `facts:${ip}`, windowMs: 60_000, max: 30 });
  if (!limiter.allowed) {
    return NextResponse.json({ error: "rate_limited", requestId }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = signatureSchema.safeParse(body.signature);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid signature", requestId }, { status: 400 });
  }

  const network = process.env.NEXT_PUBLIC_NETWORK || "solana-devnet";
  const key = cacheKeys.facts(network, parsed.data);
  const cached = await cacheGet(key);
  if (cached) {
    return NextResponse.json({ facts: cached, requestId, cached: true });
  }

  try {
    const facts = await getFacts(parsed.data);
    await cacheSet(key, facts, TTL);
    return NextResponse.json({ facts, requestId, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("WrongSize") || message.includes("Invalid param")) {
      return NextResponse.json({ error: "invalid signature", requestId }, { status: 400 });
    }
    return NextResponse.json({ error: "rpc_unavailable", requestId }, { status: 502 });
  }
}
