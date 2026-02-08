export default function PricingCard({ title, price, description }: { title: string; price: string; description: string }) {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="font-mono text-sm text-black/70">{title}</h3>
      <p className="mt-2 font-display text-3xl font-bold">{price}</p>
      <p className="mt-2 text-sm text-black/80">{description}</p>
    </article>
  );
}
