"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "5fZJ...2Qxk",
  "3Nmp...K7tR",
  "4mYb...9axE"
];

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
      <label className="block text-sm font-semibold text-slate-100" htmlFor="signature">
        Signature
      </label>
      <input
        id="signature"
        className="w-full rounded-xl border border-cyan-200/25 bg-slate-950/45 px-4 py-3 text-sm text-cyan-100 outline-none transition focus:border-cyan-200/70"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        placeholder="5qg..."
        autoComplete="off"
      />
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((item) => (
          <button
            className="fin-chip"
            key={item}
            onClick={(e) => {
              e.preventDefault();
              setSignature(item);
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <button className="btn-primary w-full" type="submit">
        Explain Transaction
      </button>
    </form>
  );
}
