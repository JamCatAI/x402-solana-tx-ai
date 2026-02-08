import Link from "next/link";
import PricingCard from "@/components/PricingCard";

const FEATURE_ITEMS = [
  {
    title: "Deterministic Facts First",
    body: "Every result starts with RPC-grounded balances, programs, and transfer deltas before AI text is generated."
  },
  {
    title: "Streaming Intelligence",
    body: "Facts render immediately while explanation streams in live, with final JSON validated against a strict schema."
  },
  {
    title: "x402 Monetization",
    body: "Built-in paywall flow with HTTP 402 semantics so browser users and agents both support paid analysis calls."
  }
];

export default function HomePage() {
  return (
    <main className="fin-shell">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <header className="fin-panel animate-rise flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-300 to-blue-500" />
            <p className="text-sm font-semibold tracking-wide text-cyan-100">Solana Tx AI</p>
          </div>
          <nav className="flex items-center gap-2">
            <Link className="btn-ghost text-sm" href="/docs/api">
              API Docs
            </Link>
            <Link className="btn-primary text-sm" href="/tx">
              Launch App
            </Link>
          </nav>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="fin-panel animate-rise p-7 md:p-9">
            <span className="fin-chip">Solana Devnet + x402</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Premium transaction intelligence,
              <span className="text-cyan-300"> paid per request</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Paste a transaction signature and receive deterministic facts instantly, then a streamed AI explanation with
              category labels and confidence scoring.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/tx">
                Analyze Transaction
              </Link>
              <Link className="btn-ghost" href="/docs/api">
                See API Examples
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="fin-kpi">
                <p className="text-xs uppercase tracking-wider text-slate-300">Fact latency</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">~1s</p>
              </div>
              <div className="fin-kpi">
                <p className="text-xs uppercase tracking-wider text-slate-300">AI mode</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">Stream</p>
              </div>
              <div className="fin-kpi">
                <p className="text-xs uppercase tracking-wider text-slate-300">Billing</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">x402</p>
              </div>
            </div>
          </article>

          <article className="fin-panel animate-rise p-6" style={{ animationDelay: "120ms" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Live Snapshot</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-cyan-200/20 bg-slate-950/35 p-4">
                <p className="text-xs text-slate-400">Signature</p>
                <p className="mt-1 break-all font-mono text-xs text-cyan-100">
                  5f6...Y2Qj (example)
                </p>
              </div>
              <div className="rounded-xl border border-cyan-200/20 bg-slate-950/35 p-4">
                <p className="text-xs text-slate-400">Detected category</p>
                <p className="mt-1 text-lg font-semibold text-emerald-300">swap</p>
              </div>
              <div className="rounded-xl border border-cyan-200/20 bg-slate-950/35 p-4">
                <p className="text-xs text-slate-400">Confidence</p>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                </div>
                <p className="mt-2 text-xs text-slate-300">0.78 with deterministic facts present.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {FEATURE_ITEMS.map((item, index) => (
            <article
              className="fin-panel animate-rise p-5"
              key={item.title}
              style={{ animationDelay: `${140 + index * 90}ms` }}
            >
              <h2 className="text-lg font-semibold text-cyan-100">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <PricingCard title="/tx/[signature]" price="$0.01" description="Premium browser UX with streaming explanation." />
          <PricingCard title="/api/tx/explain" price="$0.03" description="Paid JSON endpoint for bots and developer workflows." />
          <PricingCard
            title="/api/tx/explain/stream"
            price="$0.05"
            description="Facts-first SSE stream with progressive AI summary."
            featured
          />
        </section>
      </div>
    </main>
  );
}
