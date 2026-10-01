import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/services/product-service";
import type { Gender } from "@/types/product";

const SLUG_TO_GENDER: Record<string, Gender> = {
  hombre: "HOMBRE",
  mujer: "MUJER",
  unisex: "UNISEX",
  nicho: "NICHO",
};

const SLUG_LABEL: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
  nicho: "Perfumería de nicho",
};

export default async function CategoriaPage(props: PageProps<"/categoria/[slug]">) {
  const { slug } = await props.params;
  const gender = SLUG_TO_GENDER[slug];
  if (!gender) notFound();

  const products = await getProducts({ gender });

  return (
    <section className="max-w-6xl mx-auto px-5 py-14">
      <p className="eyebrow mb-2">Categoría</p>
      <h1 className="font-display text-3xl text-luxury-warm mb-8">{SLUG_LABEL[slug]}</h1>
      <ProductGrid products={products} />
    </section>
  );
}
