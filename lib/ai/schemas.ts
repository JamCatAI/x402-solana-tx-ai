import { z } from "zod";

export const signatureSchema = z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,120}$/);

export const txFactsSchema = z.object({
  signature: z.string(),
  slot: z.number().nullable(),
  blockTime: z.number().nullable(),
  success: z.boolean(),
  feeLamports: z.number(),
  programs: z.array(z.object({ programId: z.string(), label: z.string().optional() })),
  solTransfers: z.array(z.object({ from: z.string(), to: z.string(), lamports: z.number(), inferred: z.boolean().optional() })),
  tokenDeltas: z.array(z.object({
    owner: z.string(),
    mint: z.string(),
    preAmount: z.string(),
    postAmount: z.string(),
    delta: z.string(),
    decimals: z.number()
  })),
  warnings: z.array(z.string())
});

export const txAiResultSchema = z.object({
  facts: txFactsSchema,
  summary: z.string(),
  category: z.enum(["swap", "transfer", "stake", "nft", "mint", "bridge", "unknown"]),
  tags: z.array(z.string()),
  userActions: z.array(z.object({ action: z.string(), details: z.string() })),
  confidence: z.number().min(0).max(1),
  warnings: z.array(z.string()),
  tax: z.object({
    rows: z.array(z.object({
      timestamp: z.string(),
      proceeds: z.string(),
      costBasis: z.string().optional(),
      fee: z.string(),
      notes: z.string()
    }))
  }).optional()
});

export type TxFacts = z.infer<typeof txFactsSchema>;
export type TxAIResult = z.infer<typeof txAiResultSchema>;
