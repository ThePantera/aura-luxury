import { HeroCinematic } from "@/components/HeroCinematic";
import { CategorySection } from "@/components/CategorySection";
import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/services/product-service";

export default async function HomePage() {
  const featured = await getProducts({ sort: "mejor-valorados" });

  return (
    <>
      <HeroCinematic />
      <CategorySection />
      <section className="max-w-6xl mx-auto px-5 py-16">
        <p className="eyebrow mb-2">Colección</p>
        <h2 className="font-display text-2xl text-luxury-warm mb-8">Destacados</h2>
        <ProductGrid products={featured.slice(0, 8)} />
      </section>
    </>
  );
}
