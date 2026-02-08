export default function JsonViewer({ value }: { value: unknown }) {
  return (
    <pre className="overflow-auto rounded-xl border border-cyan-200/20 bg-[#041a2e] p-4 text-xs leading-6 text-cyan-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
