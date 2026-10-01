import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getReviewsByProduct } from "@/services/product-service";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ReviewSection } from "@/components/ReviewSection";

export async function generateMetadata(props: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.brand} ${product.name} | AURA Luxury Fragrances`,
    description: product.description ?? `${product.brand} ${product.name} — perfumería original.`,
  };
}

export default async function ProductoPage(props: PageProps<"/producto/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await getReviewsByProduct(product.id);

  return (
    <section className="max-w-5xl mx-auto px-5 py-14">
      <ProductDetailClient product={product} />
      <ReviewSection
        reviews={reviews}
        average={product.reviewSummary.average}
        count={product.reviewSummary.publishedCount}
      />
    </section>
  );
}
