/**
 * ============================================================
 * MOCK DATA — SOLO DESARROLLO LOCAL
 * ============================================================
 * Estos productos NO son el catálogo real "Diseñador Hombre".
 * Se usan únicamente para poder ver y probar la interfaz mientras
 * no está conectada la base de datos (sección 78 del master spec:
 * los datos ficticios no deben llegar a producción).
 *
 * Cuando tengas el catálogo real, se importa a la tabla `products`
 * / `product_variants` de Prisma conservando `supplierOriginalName`
 * (sección 60/63) y este archivo se puede borrar.
 * ============================================================
 */

import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1",
    brand: "GIVENCHY",
    name: "L'Interdit Parfum 10ml",
    normalizedName: "l-interdit-parfum",
    slug: "givenchy-linterdit-parfum-10ml",
    gender: "MUJER",
    categorySlug: "mujer",
    concentration: "Parfum",
    active: true,
    isNew: false,
    isOffer: false,
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
        type: "PRODUCTO",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "var-1", volumeMl: 10, presentation: "CERRADO", price: 23625, stock: 5, active: true },
    ],
    reviewSummary: { average: 4.9, publishedCount: 1 },
  },
  {
    id: "mock-2",
    brand: "PACO RABANNE",
    name: "Invictus EDT 100ml",
    normalizedName: "invictus-edt",
    slug: "paco-rabanne-invictus-edt-100ml",
    gender: "HOMBRE",
    categorySlug: "hombre",
    concentration: "EDT",
    active: true,
    isNew: true,
    isOffer: false,
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80",
        type: "PRODUCTO",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "var-2", volumeMl: 100, presentation: "CERRADO", price: 118750, stock: 5, active: true },
    ],
    reviewSummary: { average: null, publishedCount: 0 },
  },
  {
    id: "mock-3",
    brand: "CALVIN KLEIN",
    name: "CK One EDT 200ml",
    normalizedName: "ck-one-edt",
    slug: "calvin-klein-ck-one-edt-200ml",
    gender: "UNISEX",
    categorySlug: "unisex",
    concentration: "EDT",
    active: true,
    isNew: false,
    isOffer: false,
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
        type: "PRODUCTO",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "var-3", volumeMl: 200, presentation: "CERRADO", price: 99875, stock: 2, active: true },
    ],
    reviewSummary: { average: 4.8, publishedCount: 4 },
  },
  {
    id: "mock-4",
    brand: "AMOUAGE",
    name: "Interlude Man 100ml",
    normalizedName: "interlude-man",
    slug: "amouage-interlude-man-100ml",
    gender: "NICHO",
    categorySlug: "nicho",
    concentration: "EDP",
    active: true,
    isNew: false,
    isOffer: false,
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80",
        type: "PRODUCTO",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "var-4", volumeMl: 100, presentation: "CERRADO", price: 298750, stock: 2, active: true },
    ],
    reviewSummary: { average: 4.9, publishedCount: 2 },
  },
];

/**
 * Reseñas de ejemplo — únicamente para probar los estados de la UI
 * (sección 49: nunca inventar testimonios reales). Reemplazar por
 * datos reales de la tabla `reviews` en cuanto haya compras verdaderas.
 */
import type { Review } from "@/types/product";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "mock-1",
    authorName: "Valeria M.",
    rating: 5,
    title: "Muy duradero",
    comment: "Excelente fijación, dura toda la jornada.",
    wouldRecommend: true,
    verifiedPurchase: true,
    status: "PUBLICADA",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-2",
    productId: "mock-3",
    authorName: "Sofía R.",
    rating: 5,
    title: "Clásico que nunca falla",
    comment: "Fresco y versátil, ideal para el día a día.",
    wouldRecommend: true,
    verifiedPurchase: true,
    status: "PUBLICADA",
    createdAt: new Date().toISOString(),
  },
];
