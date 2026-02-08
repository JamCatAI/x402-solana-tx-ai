export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold">API Docs</h1>
      <p className="mt-3">x402 v2 headers: PAYMENT-REQUIRED, PAYMENT-SIGNATURE, PAYMENT-RESPONSE. v1 X-PAYMENT is optional legacy.</p>

      <h2 className="mt-8 text-2xl font-semibold">curl</h2>
      <pre className="mt-3 overflow-auto rounded bg-ink p-4 text-sm text-white">
{`curl -X POST http://localhost:3000/api/tx/explain \\
  -H 'content-type: application/json' \\
  -d '{"signature":"<sig>","mode":"basic"}'`}
      </pre>

      <h2 className="mt-8 text-2xl font-semibold">Node + @x402/fetch</h2>
      <pre className="mt-3 overflow-auto rounded bg-ink p-4 text-sm text-white">
{`import { x402Fetch } from "@x402/fetch";

const res = await x402Fetch("http://localhost:3000/api/tx/explain", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ signature: "<sig>", mode: "basic" })
});
console.log(await res.json());`}
      </pre>

      <h2 className="mt-8 text-2xl font-semibold">Networks</h2>
      <ul className="mt-3 list-disc pl-6">
        <li>Devnet CAIP-2: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1</li>
        <li>Mainnet CAIP-2: solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp</li>
        <li>Dev/test facilitator: https://www.x402.org/facilitator</li>
        <li>Mainnet facilitator: https://api.cdp.coinbase.com/platform/v2/x402</li>
      </ul>
    </main>
  );
}
