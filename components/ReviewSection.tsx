import type { Review } from "@/types/product";
import { ReviewCard } from "./ReviewCard";
import { RatingStars } from "./RatingStars";

/**
 * Reviews verificadas (sección 21-22). Solo PUBLICADA cuenta para el promedio;
 * el listado que llega acá ya debería venir filtrado por ese estado.
 */
export function ReviewSection({
  reviews,
  average,
  count,
}: {
  reviews: Review[];
  average: number | null;
  count: number;
}) {
  return (
    <section className="mt-12 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-luxury-warm">Reseñas verificadas</h2>
        <RatingStars average={average} count={count} />
      </div>
      {reviews.length === 0 ? (
        <p className="text-sm text-luxury-muted italic">Sin reseñas aún. Sé el primero en compartir tu experiencia.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
      <p className="text-[11px] text-luxury-muted mt-4">
        Solo clientes que compraron el producto pueden dejar una reseña, y queda pendiente de moderación
        hasta ser aprobada.
      </p>
    </section>
  );
}
