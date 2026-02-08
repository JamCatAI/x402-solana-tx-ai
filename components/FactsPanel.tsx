import type { TxFacts } from "@/lib/ai/schemas";
import JsonViewer from "@/components/JsonViewer";

function lamportsToSol(lamports: number) {
  return (lamports / 1_000_000_000).toFixed(6);
}

export default function FactsPanel({ facts }: { facts: TxFacts }) {
  return (
    <section className="fin-panel animate-rise p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Deterministic Facts</h2>
        <span className="fin-chip">RPC Ground Truth</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="fin-kpi">
          <p className="text-xs uppercase tracking-wider text-slate-300">Fee</p>
          <p className="mt-2 text-xl font-semibold text-cyan-200">{lamportsToSol(facts.feeLamports)} SOL</p>
        </div>
        <div className="fin-kpi">
          <p className="text-xs uppercase tracking-wider text-slate-300">Programs</p>
          <p className="mt-2 text-xl font-semibold text-cyan-200">{facts.programs.length}</p>
        </div>
        <div className="fin-kpi">
          <p className="text-xs uppercase tracking-wider text-slate-300">Transfers</p>
          <p className="mt-2 text-xl font-semibold text-cyan-200">{facts.solTransfers.length}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {facts.programs.slice(0, 8).map((program) => (
          <span className="fin-chip" key={`${program.programId}-${program.label || "na"}`}>
            {program.label || `${program.programId.slice(0, 6)}...`}
          </span>
        ))}
      </div>

      {facts.warnings.length > 0 ? (
        <div className="mt-5 rounded-xl border border-rose-300/25 bg-rose-500/10 p-3 text-sm text-rose-100">
          {facts.warnings.join(", ")}
        </div>
      ) : null}

      <div className="mt-5">
        <JsonViewer value={facts} />
      </div>
    </section>
  );
}
