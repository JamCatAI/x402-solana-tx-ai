export default function PricingCard({
  title,
  price,
  description,
  featured = false
}: {
  title: string;
  price: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <article className={`fin-panel animate-rise p-5 ${featured ? "border-emerald-300/40" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-mono text-xs text-slate-300">{title}</h3>
        {featured ? <span className="fin-chip text-emerald-200">Premium Stream</span> : null}
      </div>
      <p className="mt-4 font-display text-4xl font-semibold text-cyan-200">{price}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}
