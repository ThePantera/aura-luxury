import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { minPrice, hasStock } from "@/services/product-service";
import { RatingStars } from "./RatingStars";

function formatPrice(value: number) {
  return value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

/** Estados de la card (sección 14): nuevo, sin stock. */
export function FragranceCard({ product }: { product: Product }) {
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const price = minPrice(product);
  const inStock = hasStock(product);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group rounded-2xl border border-white/10 bg-luxury-surface overflow-hidden hover:border-luxury-gold/40 hover:-translate-y-1 transition-all"
    >
      <div className="relative h-48 bg-black">
        {primary ? (
          <Image
            src={primary.url}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-luxury-gold/60 text-xs font-display">
            Imagen próximamente
          </div>
        )}
        {product.isNew && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-luxury-gold text-black">
            NUEVO
          </span>
        )}
        {!inStock && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-luxury-muted border border-white/20">
            Sin stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">{product.brand}</p>
        <h3 className="font-display text-lg text-luxury-warm mt-1">{product.name}</h3>
        <div className="mt-1">
          <RatingStars average={product.reviewSummary.average} count={product.reviewSummary.publishedCount} />
        </div>
        <p className="mt-3 text-luxury-warm font-semibold">
          {Number.isFinite(price) ? formatPrice(price) : "Consultar disponibilidad"}
        </p>
      </div>
    </Link>
  );
}
