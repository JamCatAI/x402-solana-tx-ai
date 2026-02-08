"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="rounded-lg border border-cyan-200/30 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-cyan-100"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      type="button"
    >
      {copied ? "Copied" : "Copy JSON"}
    </button>
  );
}
