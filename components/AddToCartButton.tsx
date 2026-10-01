"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import type { Product, ProductVariant } from "@/types/product";

export function AddToCartButton({ product, variant }: { product: Product; variant: ProductVariant | undefined }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];

  if (!variant) {
    return (
      <button disabled className="w-full py-3 rounded-full bg-white/10 text-luxury-muted text-sm cursor-not-allowed">
        Elegí una presentación
      </button>
    );
  }

  const outOfStock = variant.stock <= 0;

  function handleClick() {
    if (!variant || outOfStock) return;
    addItem({
      variantId: variant.id,
      productSlug: product.slug,
      brand: product.brand,
      name: product.name,
      volumeMl: variant.volumeMl,
      presentation: variant.presentation,
      unitPrice: variant.price,
      image: primary?.url ?? null,
      quantity: 1,
      maxStock: variant.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={outOfStock}
      className="w-full py-3 rounded-full font-semibold text-sm text-black bg-gradient-to-br from-[var(--color-gold)] to-[#9c7a44] hover:-translate-y-0.5 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {outOfStock ? "Sin stock" : added ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}
