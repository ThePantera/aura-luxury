import { prisma } from "@/lib/prisma";

/**
 * Dashboard admin (sección 40). El middleware ya redirige a un CLIENT que
 * intente entrar, pero cada query de acá abajo también podría repetirse
 * con verificación de rol si se expone como API en vez de Server Component.
 */
export default async function AdminDashboard() {
  const [userCount, orderCount, productCount, pendingReviews, lowStock] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.review.count({ where: { status: "PENDIENTE" } }),
    prisma.productVariant.count({ where: { stock: { lte: 2 }, active: true } }),
  ]);

  const cards = [
    { label: "Usuarios", value: userCount },
    { label: "Pedidos", value: orderCount },
    { label: "Productos", value: productCount },
    { label: "Reseñas pendientes", value: pendingReviews },
    { label: "Variantes con stock crítico", value: lowStock },
  ];

  return (
    <section className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-luxury-warm mb-8">Panel administrativo</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-4 rounded-xl bg-luxury-surface border border-white/10 text-center">
            <p className="text-2xl font-display text-luxury-gold-light">{c.value}</p>
            <p className="text-xs text-luxury-muted mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-luxury-muted mt-8">
        {productCount === 0
          ? "Todavía no hay productos cargados en la base de datos. El catálogo público está usando datos mock hasta que se importe el catálogo real (sección 61-64)."
          : null}
      </p>
    </section>
  );
}
