"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductVariantSelector } from "./ProductVariantSelector";
import { AddToCartButton } from "./AddToCartButton";

function formatPrice(value: number) {
  return value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function ProductDetailClient({ product }: { product: Product }) {
  const activeVariants = product.variants.filter((v) => v.active);
  const [selectedId, setSelectedId] = useState<string | null>(activeVariants[0]?.id ?? null);
  const variant = activeVariants.find((v) => v.id === selectedId) ?? activeVariants[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ProductGallery images={product.images} alt={`${product.brand} ${product.name}`} />
      <div>
        <p className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">{product.brand}</p>
        <h1 className="font-display text-3xl text-luxury-warm mt-1">{product.name}</h1>
        {product.concentration && <p className="text-sm text-luxury-muted mt-1">{product.concentration}</p>}

        <p className="text-2xl font-semibold text-luxury-warm mt-4">
          {variant ? formatPrice(variant.price) : "Consultar disponibilidad"}
        </p>
        <p className="text-xs text-luxury-muted mb-4">
          {variant ? (variant.stock > 0 ? `${variant.stock} unidades disponibles` : "Sin stock por el momento") : "Consultar disponibilidad"}
        </p>

        <ProductVariantSelector variants={activeVariants} selectedId={selectedId} onSelect={setSelectedId} />

        <AddToCartButton product={product} variant={variant} />

        {product.description && <p className="text-sm text-luxury-muted mt-6 leading-relaxed">{product.description}</p>}
        {product.olfactoryNotes && (
          <p className="text-xs text-luxury-muted mt-3">
            <span className="text-luxury-gold-light">Notas: </span>
            {product.olfactoryNotes}
          </p>
        )}
      </div>
    </div>
  );
}
