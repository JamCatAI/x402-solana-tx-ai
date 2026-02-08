export default function ApiDocsPage() {
  return (
    <main className="fin-shell">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <section className="fin-panel animate-rise p-7 md:p-9">
          <span className="fin-chip">Developer Docs</span>
          <h1 className="mt-4 text-4xl font-semibold">API + Payment Headers</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Preferred x402 v2 headers: <code>PAYMENT-REQUIRED</code>, <code>PAYMENT-SIGNATURE</code>, <code>PAYMENT-RESPONSE</code>.
            Legacy <code>X-PAYMENT</code> remains optional.
          </p>
        </section>

        <section className="mt-6 fin-panel animate-rise p-6" style={{ animationDelay: "120ms" }}>
          <h2 className="text-2xl font-semibold">curl</h2>
          <pre className="mt-4 overflow-auto rounded-xl border border-cyan-200/20 bg-[#041a2e] p-4 text-xs text-cyan-100">
{`curl -X POST http://localhost:3000/api/tx/explain \\
  -H 'content-type: application/json' \\
  -d '{"signature":"<sig>","mode":"basic"}'`}
          </pre>

          <h2 className="mt-7 text-2xl font-semibold">Node + @x402/fetch</h2>
          <pre className="mt-4 overflow-auto rounded-xl border border-cyan-200/20 bg-[#041a2e] p-4 text-xs text-cyan-100">
{`import { x402Fetch } from "@x402/fetch";

const res = await x402Fetch("http://localhost:3000/api/tx/explain", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ signature: "<sig>", mode: "basic" })
});
console.log(await res.json());`}
          </pre>
        </section>

        <section className="mt-6 fin-panel animate-rise p-6" style={{ animationDelay: "180ms" }}>
          <h2 className="text-2xl font-semibold">Network IDs</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            <li>
              <span className="font-semibold text-cyan-200">Devnet CAIP-2:</span> solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
            </li>
            <li>
              <span className="font-semibold text-cyan-200">Mainnet CAIP-2:</span> solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp
            </li>
            <li>
              <span className="font-semibold text-cyan-200">Dev/Test facilitator:</span> https://www.x402.org/facilitator
            </li>
            <li>
              <span className="font-semibold text-cyan-200">Mainnet facilitator:</span> https://api.cdp.coinbase.com/platform/v2/x402
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
