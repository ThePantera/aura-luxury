import Link from "next/link";

const CATEGORIES = [
  { slug: "hombre", label: "Hombre" },
  { slug: "mujer", label: "Mujer" },
  { slug: "unisex", label: "Unisex" },
  { slug: "nicho", label: "Perfumería de nicho" },
];

/** Sección 12: cada categoría lleva al catálogo con el filtro aplicado. */
export function CategorySection() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <p className="eyebrow mb-2">Mundos olfativos</p>
      <h2 className="font-display text-2xl text-luxury-warm mb-8">Encontrá tu categoría</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="rounded-2xl border border-white/10 bg-luxury-surface p-6 text-center text-luxury-warm text-sm hover:border-luxury-gold/60 hover:-translate-y-1 transition-all"
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
