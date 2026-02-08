import SignatureForm from "@/components/SignatureForm";

export default function TxInputPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold">Analyze a Solana Transaction</h1>
      <p className="mt-3">Enter a transaction signature to view paid explanation results.</p>
      <div className="mt-8 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
        <SignatureForm />
      </div>
    </main>
  );
}
