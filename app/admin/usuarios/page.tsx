// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { prisma } from "@/lib/prisma";

interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  firstPurchaseDiscount: string;
  _count: { orders: number };
}

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { orders: true } } },
  });

  return (
    <section className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display text-2xl text-luxury-warm mb-6">Usuarios</h1>
      {users.length === 0 ? (
        <p className="text-sm text-luxury-muted">Sin usuarios registrados todavía.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-luxury-muted border-b border-white/10">
            <tr>
              <th className="py-2">Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>20% OFF</th>
              <th>Pedidos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: UserRow) => (
              <tr key={u.id} className="border-b border-white/5 text-luxury-warm">
                <td className="py-2">{u.name} <span className="text-luxury-muted">@{u.username}</span></td>
                <td className="text-luxury-muted">{u.email}</td>
                <td>{u.role}</td>
                <td className="text-luxury-muted">{u.firstPurchaseDiscount}</td>
                <td className="text-luxury-muted">{u._count.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Cambiar el rol a ADMIN NO se expone acá a propósito (sección 25) — se hace directo en la base de datos. */}
    </section>
  );
}
