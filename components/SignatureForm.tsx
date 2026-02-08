"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignatureForm() {
  const [signature, setSignature] = useState("");
  const router = useRouter();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!signature.trim()) return;
        router.push(`/tx/${signature.trim()}`);
      }}
    >
      <label className="block text-sm font-semibold" htmlFor="signature">Signature</label>
      <input
        id="signature"
        className="w-full rounded border border-black/20 bg-white px-3 py-2"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        placeholder="5qg..."
      />
      <button className="rounded bg-accent px-4 py-2 text-white" type="submit">Explain</button>
    </form>
  );
}
