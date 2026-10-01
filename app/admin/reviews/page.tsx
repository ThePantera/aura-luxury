// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { prisma } from "@/lib/prisma";

interface ReviewRow {
  id: string;
  rating: number;
  comment: string;
  product: { brand: string; name: string };
  user: { name: string };
}
import { publishReview, rejectReview } from "@/actions/reviews";

/** Sección 44: moderación de reseñas con Server Actions (protegidas en actions/reviews.ts). */
export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { status: "PENDIENTE" },
    include: { product: true, user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display text-2xl text-luxury-warm mb-6">Reseñas pendientes</h1>
      {reviews.length === 0 ? (
        <p className="text-sm text-luxury-muted">No hay reseñas esperando moderación.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: ReviewRow) => (
            <div key={r.id} className="p-4 rounded-xl bg-luxury-surface border border-white/10 text-sm">
              <p className="text-luxury-gold-light font-medium">{r.product.brand} {r.product.name}</p>
              <p className="text-xs text-luxury-muted mb-2">{r.user.name} · {"★".repeat(r.rating)}</p>
              <p className="text-luxury-warm">{r.comment}</p>
              <div className="flex gap-3 mt-3">
                <form action={async () => { "use server"; await publishReview(r.id); }}>
                  <button className="text-xs px-3 py-1.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/40">
                    Publicar
                  </button>
                </form>
                <form action={async () => { "use server"; await rejectReview(r.id); }}>
                  <button className="text-xs px-3 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/40">
                    Rechazar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
