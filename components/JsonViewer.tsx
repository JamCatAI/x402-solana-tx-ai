export default function JsonViewer({ value }: { value: unknown }) {
  return <pre className="overflow-auto rounded bg-ink p-4 text-xs text-white">{JSON.stringify(value, null, 2)}</pre>;
}
