import FactsPanel from "@/components/FactsPanel";
import ExplanationStream from "@/components/ExplanationStream";
import { getFacts } from "@/lib/solana/parseTxFacts";

export default async function TxResultPage({ params }: { params: Promise<{ signature: string }> }) {
  const { signature } = await params;
  const facts = await getFacts(signature);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">Transaction: {signature}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FactsPanel facts={facts} />
        <ExplanationStream signature={signature} initialFacts={facts} />
      </div>
    </main>
  );
}
