import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "@/types/product";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-3 rounded-lg bg-luxury-surface border border-white/10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-luxury-gold-light flex items-center gap-1">
          {review.authorName}
          {review.verifiedPurchase && <BadgeCheck size={14} className="text-emerald-400" />}
        </span>
        <div className="flex text-luxury-gold-light">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={12} className="fill-luxury-gold-light" />
          ))}
        </div>
      </div>
      {review.title && <p className="text-sm text-luxury-warm font-medium">{review.title}</p>}
      <p className="text-xs text-luxury-muted mt-1">{review.comment}</p>
    </div>
  );
}
