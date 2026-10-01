"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";

/** Galería de hasta 4 imágenes (sección 16). Si hay menos, solo se muestran esas. */
export function ProductGallery({ images, alt }: { images: ProductImage[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden border border-white/10 bg-black">
        {current ? (
          <Image src={current.url} alt={alt} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-luxury-gold/60 font-display">
            Imagen próximamente
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border ${
                i === active ? "border-luxury-gold" : "border-white/10"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
