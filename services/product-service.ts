/**
 * Capa de acceso a datos de productos.
 *
 * Hoy devuelve MOCK_PRODUCTS (ver lib/mock-data.ts). Cuando la base
 * de datos esté conectada, estas mismas funciones se reimplementan
 * con `prisma.product.findMany(...)` — los componentes que las
 * consumen (ProductGrid, ProductDetail, etc.) no deberían cambiar.
 */

import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product, Gender } from "@/types/product";

export interface ProductFilters {
  search?: string;
  gender?: Gender;
  sort?: "relevancia" | "precio-asc" | "precio-desc" | "novedades" | "mejor-valorados";
}

function minPrice(p: Product): number {
  const active = p.variants.filter((v) => v.active);
  return active.length ? Math.min(...active.map((v) => v.price)) : Infinity;
}

function hasStock(p: Product): boolean {
  return p.variants.some((v) => v.active && v.stock > 0);
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let items = MOCK_PRODUCTS.filter((p) => p.active);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.line ?? "").toLowerCase().includes(q) ||
        (p.concentration ?? "").toLowerCase().includes(q)
    );
  }

  if (filters.gender) {
    items = items.filter((p) => p.gender === filters.gender);
  }

  switch (filters.sort) {
    case "precio-asc":
      items = [...items].sort((a, b) => minPrice(a) - minPrice(b));
      break;
    case "precio-desc":
      items = [...items].sort((a, b) => minPrice(b) - minPrice(a));
      break;
    case "mejor-valorados":
      items = [...items].sort((a, b) => (b.reviewSummary.average ?? 0) - (a.reviewSummary.average ?? 0));
      break;
    case "novedades":
      items = [...items].sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      break;
  }

  return items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export { hasStock, minPrice };

import { MOCK_REVIEWS } from "@/lib/mock-data";
import type { Review } from "@/types/product";

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  return MOCK_REVIEWS.filter((r) => r.productId === productId && r.status === "PUBLICADA");
}
