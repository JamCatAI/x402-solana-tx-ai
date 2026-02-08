import type { TxFacts } from "@/lib/ai/schemas";
import JsonViewer from "@/components/JsonViewer";

export default function FactsPanel({ facts }: { facts: TxFacts }) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="font-display text-2xl font-bold">Facts</h2>
      <p className="mt-2 text-sm">Deterministic output from Solana RPC.</p>
      <div className="mt-4">
        <JsonViewer value={facts} />
      </div>
    </section>
  );
}
