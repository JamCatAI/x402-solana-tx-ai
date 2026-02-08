import FactsPanel from "@/components/FactsPanel";
import ExplanationStream from "@/components/ExplanationStream";
import { getFacts } from "@/lib/solana/parseTxFacts";

export default async function TxResultPage({ params }: { params: Promise<{ signature: string }> }) {
  const { signature } = await params;
  const facts = await getFacts(signature);

  return (
    <main className="fin-shell">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="fin-panel animate-rise p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="fin-chip">Mission Control</span>
              <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Transaction Intelligence</h1>
            </div>
            <span className={`fin-chip ${facts.success ? "text-emerald-200" : "text-rose-200"}`}>
              {facts.success ? "Success" : "Failed"}
            </span>
          </div>
          <p className="mt-4 break-all rounded-lg border border-cyan-200/20 bg-slate-950/35 px-3 py-2 font-mono text-xs text-cyan-100">
            {signature}
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FactsPanel facts={facts} />
          <ExplanationStream signature={signature} initialFacts={facts} />
        </div>
      </div>
    </main>
  );
}
