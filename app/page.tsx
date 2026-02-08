import Link from "next/link";
import PricingCard from "@/components/PricingCard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-5xl font-bold">Solana Tx AI</h1>
      <p className="mt-4 max-w-2xl text-lg">
        Paste a Solana signature, get deterministic transaction facts instantly, then a streamed AI summary and labels.
      </p>
      <div className="mt-8 flex gap-4">
        <Link className="rounded bg-accent px-4 py-2 text-white" href="/tx">Try /tx</Link>
        <Link className="rounded border border-ink px-4 py-2" href="/docs/api">API Docs</Link>
      </div>
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <PricingCard title="/tx/[signature]" price="$0.01" description="Browser UX with streaming" />
        <PricingCard title="/api/tx/explain" price="$0.03" description="JSON result for devs/agents" />
        <PricingCard title="/api/tx/explain/stream" price="$0.05" description="Facts first + live summary" />
      </section>
    </main>
  );
}
