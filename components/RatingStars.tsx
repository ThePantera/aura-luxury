import { Star } from "lucide-react";

/**
 * Sistema de rating (sección 20). Sin reseñas -> "Sin reseñas aún", nunca 0.0/5.
 */
export function RatingStars({
  average,
  count,
  size = 12,
}: {
  average: number | null;
  count: number;
  size?: number;
}) {
  if (average === null || count === 0) {
    return <span className="text-xs text-luxury-muted">Sin reseñas aún</span>;
  }

  return (
    <div className="flex items-center gap-1 text-xs text-luxury-muted">
      <Star size={size} className="fill-luxury-gold-light text-luxury-gold-light" />
      <span>
        {average.toFixed(1)} / 5 · {count} {count === 1 ? "reseña" : "reseñas"}
      </span>
    </div>
  );
}
