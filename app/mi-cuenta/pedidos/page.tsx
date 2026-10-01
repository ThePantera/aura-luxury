import { auth } from "@/auth";
// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { prisma } from "@/lib/prisma";

interface OrderRow {
  id: string;
  publicNumber: string;
  status: string;
  total: unknown;
  items: unknown[];
}

export default async function MisPedidosPage() {
  const session = await auth();
  const orders = session?.user?.email
    ? await prisma.order.findMany({
        where: { user: { email: session.user.email } },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display text-2xl text-luxury-warm mb-6">Mis pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-luxury-muted">Todavía no hiciste ningún pedido.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o: OrderRow) => (
            <div key={o.id} className="p-4 rounded-xl bg-luxury-surface border border-white/10 flex justify-between text-sm">
              <div>
                <p className="text-luxury-gold-light font-medium">{o.publicNumber}</p>
                <p className="text-xs text-luxury-muted">{o.items.length} producto(s) · {o.status}</p>
              </div>
              <p className="text-luxury-warm font-semibold">${Number(o.total).toLocaleString("es-AR")}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
