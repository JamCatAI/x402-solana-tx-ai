"use client";

import { useEffect, useMemo, useState } from "react";
import type { TxFacts, TxAIResult } from "@/lib/ai/schemas";
import CopyButton from "@/components/CopyButton";
import JsonViewer from "@/components/JsonViewer";

export default function ExplanationStream({ signature, initialFacts }: { signature: string; initialFacts: TxFacts }) {
  const [mode, setMode] = useState<"basic" | "tax">("basic");
  const [summaryStream, setSummaryStream] = useState("");
  const [finalResult, setFinalResult] = useState<TxAIResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setSummaryStream("");
      setFinalResult(null);

      const res = await fetch("/api/tx/explain/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature, mode }),
        signal: controller.signal
      });

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const event of events) {
          const line = event.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const payload = JSON.parse(line.replace(/^data:\s*/, ""));
          if (payload.type === "summary") setSummaryStream((prev) => prev + payload.chunk);
          if (payload.type === "final") setFinalResult(payload.result);
        }
      }

      setLoading(false);
    };

    run().catch(() => setLoading(false));
    return () => controller.abort();
  }, [signature, mode]);

  const exportPayload = useMemo(() => finalResult || { facts: initialFacts, summary: summaryStream }, [finalResult, initialFacts, summaryStream]);

  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Explanation</h2>
        <div className="flex items-center gap-2">
          <select className="rounded border border-black/20 px-2 py-1 text-sm" value={mode} onChange={(e) => setMode(e.target.value as "basic" | "tax") }>
            <option value="basic">Basic</option>
            <option value="tax">Tax</option>
          </select>
          <CopyButton text={JSON.stringify(exportPayload, null, 2)} />
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{summaryStream || (loading ? "Streaming..." : "No streamed output yet")}</p>
      {finalResult ? (
        <div className="mt-5">
          <JsonViewer value={finalResult} />
        </div>
      ) : null}
    </section>
  );
}
