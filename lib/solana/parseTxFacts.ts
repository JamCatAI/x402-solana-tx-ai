import type { ParsedInstruction, ParsedTransactionWithMeta } from "@solana/web3.js";
import { solanaConnection } from "@/lib/solana/connection";
import { PROGRAM_LABELS } from "@/lib/solana/programLabels";
import type { TxFacts } from "@/lib/ai/schemas";

function parseSystemTransfers(tx: ParsedTransactionWithMeta): TxFacts["solTransfers"] {
  const out: TxFacts["solTransfers"] = [];
  const instructions = tx.transaction.message.instructions;
  for (const ix of instructions) {
    if ("parsed" in ix && ix.program === "system") {
      const parsed = (ix as ParsedInstruction).parsed as { type?: string; info?: Record<string, unknown> };
      if (parsed.type === "transfer" && parsed.info) {
        const from = String(parsed.info.source || "");
        const to = String(parsed.info.destination || "");
        const lamports = Number(parsed.info.lamports || 0);
        out.push({ from, to, lamports });
      }
    }
  }
  return out;
}

function inferBalanceTransfers(tx: ParsedTransactionWithMeta): TxFacts["solTransfers"] {
  const keys = tx.transaction.message.accountKeys.map((k) => k.pubkey.toBase58());
  const pre = tx.meta?.preBalances || [];
  const post = tx.meta?.postBalances || [];
  const debits: Array<{ account: string; amount: number }> = [];
  const credits: Array<{ account: string; amount: number }> = [];

  for (let i = 0; i < Math.min(pre.length, post.length); i += 1) {
    const delta = post[i] - pre[i];
    if (delta < 0) debits.push({ account: keys[i], amount: Math.abs(delta) });
    if (delta > 0) credits.push({ account: keys[i], amount: delta });
  }

  const out: TxFacts["solTransfers"] = [];
  if (debits.length && credits.length) {
    out.push({ from: debits[0].account, to: credits[0].account, lamports: Math.min(debits[0].amount, credits[0].amount), inferred: true });
  }
  return out;
}

function toTokenMap(
  items: NonNullable<NonNullable<ParsedTransactionWithMeta["meta"]>["preTokenBalances"]> | undefined | null
) {
  const map = new Map<string, { owner: string; mint: string; amount: string; decimals: number }>();
  for (const item of items || []) {
    const owner = item.owner || "unknown";
    const mint = item.mint;
    const amount = item.uiTokenAmount.amount;
    const decimals = item.uiTokenAmount.decimals;
    map.set(`${owner}:${mint}`, { owner, mint, amount, decimals });
  }
  return map;
}

export function factsFromParsedTx(signature: string, tx: ParsedTransactionWithMeta | null): TxFacts {
  const warnings: string[] = [];
  if (!tx) {
    return {
      signature,
      slot: null,
      blockTime: null,
      success: false,
      feeLamports: 0,
      programs: [],
      solTransfers: [],
      tokenDeltas: [],
      warnings: ["tx not found"]
    };
  }

  if (!tx.meta) warnings.push("missing meta");

  const programs = tx.transaction.message.instructions.map((ix) => {
    const programId = "programId" in ix ? ix.programId.toBase58() : "unknown";
    return { programId, label: PROGRAM_LABELS[programId] };
  });

  const parsedTransfers = parseSystemTransfers(tx);
  const solTransfers = parsedTransfers.length ? parsedTransfers : inferBalanceTransfers(tx);
  if (!parsedTransfers.length && solTransfers.length) warnings.push("parsed fallback");

  const preMap = toTokenMap(tx.meta?.preTokenBalances);
  const postMap = toTokenMap(tx.meta?.postTokenBalances);
  const keys = new Set([...preMap.keys(), ...postMap.keys()]);
  const tokenDeltas: TxFacts["tokenDeltas"] = Array.from(keys).map((k) => {
    const pre = preMap.get(k);
    const post = postMap.get(k);
    const preAmount = pre?.amount || "0";
    const postAmount = post?.amount || "0";
    return {
      owner: post?.owner || pre?.owner || "unknown",
      mint: post?.mint || pre?.mint || "unknown",
      preAmount,
      postAmount,
      delta: (BigInt(postAmount) - BigInt(preAmount)).toString(),
      decimals: post?.decimals ?? pre?.decimals ?? 0
    };
  });

  return {
    signature,
    slot: tx.slot,
    blockTime: tx.blockTime || null,
    success: tx.meta?.err == null,
    feeLamports: tx.meta?.fee || 0,
    programs,
    solTransfers,
    tokenDeltas,
    warnings
  };
}

export async function getFacts(signature: string): Promise<TxFacts> {
  const tx = await solanaConnection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed"
  });
  return factsFromParsedTx(signature, tx);
}
