import { ProductGrid } from "@/components/ProductGrid";
import { CatalogControls } from "@/components/CatalogControls";
import { getProducts } from "@/services/product-service";
import type { Gender } from "@/types/product";

export default async function CatalogoPage(props: PageProps<"/catalogo">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sort = typeof searchParams.sort === "string" ? (searchParams.sort as any) : undefined;

  const products = await getProducts({ search: q, sort });

  return (
    <section className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-luxury-warm mb-6">Catálogo</h1>
      <CatalogControls />
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
