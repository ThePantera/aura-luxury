// Tipos de dominio — reflejan el modelo de prisma/schema.prisma (sección 15)

export type Gender = "HOMBRE" | "MUJER" | "UNISEX" | "NICHO";

export type Presentation =
  | "CERRADO"
  | "TESTER"
  | "TESTER_SIN_CAJA"
  | "COFRE"
  | "COFRE_DEO"
  | "EDICION_LIMITADA"
  | "LANZAMIENTO"
  | "OTRO";

export type ImageType = "PRODUCTO" | "PACKAGING" | "DETAIL" | "LIFESTYLE";

export interface ProductImage {
  id: string;
  url: string;
  type: ImageType;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  volumeMl: number;
  presentation: Presentation;
  price: number;
  stock: number;
  active: boolean;
}

export interface ReviewSummary {
  average: number | null; // null = "Sin reseñas aún" (sección 20)
  publishedCount: number;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  normalizedName: string;
  slug: string;
  line?: string;
  gender: Gender;
  categorySlug: string;
  concentration?: string;
  description?: string;
  olfactoryNotes?: string;
  active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  reviewSummary: ReviewSummary;
  isNew: boolean;
  isOffer: boolean;
}

export type ReviewStatus = "PENDIENTE" | "PUBLICADA" | "RECHAZADA";

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  wouldRecommend: boolean;
  verifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt: string;
}

export type DiscountStatus = "AVAILABLE" | "RESERVED" | "USED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "ADMIN";
  firstPurchaseDiscount: DiscountStatus;
}

export interface CartLine {
  variantId: string;
  productSlug: string;
  quantity: number;
}
