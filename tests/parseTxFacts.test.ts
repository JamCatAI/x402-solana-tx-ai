import { describe, expect, test } from "vitest";
import { factsFromParsedTx } from "@/lib/solana/parseTxFacts";

describe("factsFromParsedTx", () => {
  test("returns tx not found warning when null", () => {
    const facts = factsFromParsedTx("abc", null);
    expect(facts.warnings).toContain("tx not found");
    expect(facts.success).toBe(false);
  });

  test("parses fee and token deltas", () => {
    const tx = {
      slot: 1,
      blockTime: 1700000000,
      meta: {
        err: null,
        fee: 5000,
        preBalances: [10_000, 0],
        postBalances: [4_000, 6_000],
        preTokenBalances: [
          {
            owner: "owner1",
            mint: "mint1",
            uiTokenAmount: { amount: "100", decimals: 6 }
          }
        ],
        postTokenBalances: [
          {
            owner: "owner1",
            mint: "mint1",
            uiTokenAmount: { amount: "250", decimals: 6 }
          }
        ]
      },
      transaction: {
        message: {
          accountKeys: [{ pubkey: { toBase58: () => "from" } }, { pubkey: { toBase58: () => "to" } }],
          instructions: []
        }
      }
    } as any;

    const facts = factsFromParsedTx("sig", tx);
    expect(facts.feeLamports).toBe(5000);
    expect(facts.success).toBe(true);
    expect(facts.tokenDeltas[0].delta).toBe("150");
    expect(facts.solTransfers[0].inferred).toBe(true);
  });
});
