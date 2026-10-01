// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { prisma } from "@/lib/prisma";

interface OrderRow {
  id: string;
  publicNumber: string;
  customerName: string;
  status: string;
  total: unknown;
  paymentMethod: string;
  items: unknown[];
}

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: true },
  });

  return (
    <section className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display text-2xl text-luxury-warm mb-6">Pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-luxury-muted">Sin pedidos registrados todavía.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-luxury-muted border-b border-white/10">
            <tr>
              <th className="py-2">Número</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: OrderRow) => (
              <tr key={o.id} className="border-b border-white/5 text-luxury-warm">
                <td className="py-2 text-luxury-gold-light">{o.publicNumber}</td>
                <td className="text-luxury-muted">{o.customerName}</td>
                <td className="text-luxury-muted">{o.items.length}</td>
                <td>${Number(o.total).toLocaleString("es-AR")}</td>
                <td className="text-luxury-muted">{o.paymentMethod}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Acciones (confirmar transferencia, preparar, enviar, entregar, cancelar) -- sección 43: siguiente paso. */}
    </section>
  );
}
