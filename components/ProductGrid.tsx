import type { Product } from "@/types/product";
import { FragranceCard } from "./FragranceCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-luxury-muted text-sm text-center py-16">No encontramos perfumes con ese criterio.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <FragranceCard key={p.id} product={p} />
      ))}
    </div>
  );
}
