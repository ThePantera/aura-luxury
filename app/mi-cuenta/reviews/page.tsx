import { auth } from "@/auth";
// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { prisma } from "@/lib/prisma";

interface ReviewRow {
  id: string;
  status: string;
  comment: string;
  product: { brand: string; name: string };
}

export default async function MisReviewsPage() {
  const session = await auth();
  const reviews = session?.user?.email
    ? await prisma.review.findMany({
        where: { user: { email: session.user.email } },
        include: { product: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display text-2xl text-luxury-warm mb-6">Mis reseñas</h1>
      {reviews.length === 0 ? (
        <p className="text-sm text-luxury-muted">Todavía no dejaste ninguna reseña.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: ReviewRow) => (
            <div key={r.id} className="p-4 rounded-xl bg-luxury-surface border border-white/10 text-sm">
              <div className="flex justify-between">
                <p className="text-luxury-gold-light font-medium">{r.product.brand} {r.product.name}</p>
                <span className="text-xs text-luxury-muted">{r.status}</span>
              </div>
              <p className="text-xs text-luxury-muted mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
