"use client";

import type { ProductVariant } from "@/types/product";

const PRESENTATION_LABEL: Record<string, string> = {
  CERRADO: "Cerrado",
  TESTER: "Tester",
  TESTER_SIN_CAJA: "Tester sin caja",
  COFRE: "Cofre",
  COFRE_DEO: "Cofre + desodorante",
  EDICION_LIMITADA: "Edición limitada",
  LANZAMIENTO: "Lanzamiento",
  OTRO: "Otro",
};

/** Selector de variante (sección 19): cada una puede tener precio y stock distintos. */
export function ProductVariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (variants.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {variants.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          disabled={!v.active || v.stock <= 0}
          className={`text-xs px-3 py-2 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedId === v.id
              ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold-light"
              : "border-white/15 text-luxury-muted hover:border-luxury-gold/50"
          }`}
        >
          {v.volumeMl}ml · {PRESENTATION_LABEL[v.presentation]}
        </button>
      ))}
    </div>
  );
}
