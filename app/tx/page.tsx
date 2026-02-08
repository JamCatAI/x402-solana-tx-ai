import SignatureForm from "@/components/SignatureForm";

export default function TxInputPage() {
  return (
    <main className="fin-shell">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-[0.95fr_1.05fr]">
        <section className="fin-panel animate-rise p-7 md:p-9">
          <span className="fin-chip">Transaction Intake</span>
          <h1 className="mt-5 text-4xl font-semibold md:text-5xl">Analyze a Solana signature in seconds.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            This workspace fetches deterministic RPC facts first, then starts premium explanation streaming with x402-protected
            settlement.
          </p>

          <div className="mt-8 space-y-3">
            <div className="fin-kpi">
              <p className="text-xs uppercase tracking-wider text-slate-300">Flow</p>
              <p className="mt-1 text-sm text-slate-100">Input signature, then deterministic facts, then streamed classification</p>
            </div>
            <div className="fin-kpi">
              <p className="text-xs uppercase tracking-wider text-slate-300">Output shape</p>
              <p className="mt-1 text-sm text-slate-100">facts + summary + category + confidence + warnings (+tax rows)</p>
            </div>
          </div>
        </section>

        <section className="fin-panel animate-rise p-6 md:p-8" style={{ animationDelay: "120ms" }}>
          <h2 className="text-2xl font-semibold">Enter Signature</h2>
          <p className="mt-2 text-sm text-slate-300">Use any valid Solana transaction signature (base58) to begin analysis.</p>
          <div className="mt-6">
            <SignatureForm />
          </div>
        </section>
      </div>
    </main>
  );
}
