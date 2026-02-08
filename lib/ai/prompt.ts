import type { TxFacts } from "@/lib/ai/schemas";

export function buildPrompt(facts: TxFacts, mode: "basic" | "tax") {
  return `You are a Solana transaction analyst.
Return JSON only, matching schema keys exactly: facts,summary,category,tags,userActions,confidence,warnings${mode === "tax" ? ",tax" : ""}.
No markdown, no extra keys.
Facts are deterministic and must be preserved unchanged.

Facts JSON:\n${JSON.stringify(facts)}`;
}
