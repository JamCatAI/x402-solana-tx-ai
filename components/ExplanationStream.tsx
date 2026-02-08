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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      setSummaryStream("");
      setFinalResult(null);

      const res = await fetch("/api/tx/explain/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature, mode }),
        signal: controller.signal
      });

      if (!res.ok) {
        setError(`Streaming failed (${res.status}).`);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("No response stream available.");
        setLoading(false);
        return;
      }

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

    run().catch(() => {
      setError("Unable to stream explanation.");
      setLoading(false);
    });

    return () => controller.abort();
  }, [signature, mode]);

  const exportPayload = useMemo(
    () => finalResult || { facts: initialFacts, summary: summaryStream },
    [finalResult, initialFacts, summaryStream]
  );

  return (
    <section className="fin-panel animate-rise p-6" style={{ animationDelay: "100ms" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">AI Explanation</h2>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
            {loading ? <span className="stream-dot" /> : null}
            <span>{loading ? "Streaming" : "Idle"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-slate-950/35 p-1">
          <button
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${mode === "basic" ? "bg-cyan-300/25 text-cyan-100" : "text-slate-300"}`}
            onClick={() => setMode("basic")}
            type="button"
          >
            Basic
          </button>
          <button
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${mode === "tax" ? "bg-cyan-300/25 text-cyan-100" : "text-slate-300"}`}
            onClick={() => setMode("tax")}
            type="button"
          >
            Tax
          </button>
          <CopyButton text={JSON.stringify(exportPayload, null, 2)} />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-cyan-200/15 bg-slate-950/35 p-4">
        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
        {!error ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-100">
            {summaryStream || (loading ? "Waiting for streamed tokens..." : "No explanation streamed yet.")}
          </p>
        ) : null}
      </div>

      {finalResult ? (
        <div className="mt-5">
          <JsonViewer value={finalResult} />
        </div>
      ) : null}
    </section>
  );
}
