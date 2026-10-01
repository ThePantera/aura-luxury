// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { prisma } from "@/lib/prisma";

interface ProductRow {
  id: string;
  brand: string;
  name: string;
  active: boolean;
  category: { name: string };
  variants: unknown[];
}

/**
 * Sección 41: listado real de la base de datos (no del mock público).
 * El CRUD completo (crear/editar/pausar/ocultar/soft-delete) queda como
 * siguiente paso una vez definida la UI de formularios.
 */
export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <section className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display text-2xl text-luxury-warm mb-6">Productos</h1>
      {products.length === 0 ? (
        <p className="text-sm text-luxury-muted">
          Sin productos en la base de datos todavía. Importá el catálogo "Diseñador Hombre" para verlo acá.
        </p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-luxury-muted border-b border-white/10">
            <tr>
              <th className="py-2">Marca / Nombre</th>
              <th>Categoría</th>
              <th>Variantes</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: ProductRow) => (
              <tr key={p.id} className="border-b border-white/5 text-luxury-warm">
                <td className="py-2">{p.brand} {p.name}</td>
                <td className="text-luxury-muted">{p.category.name}</td>
                <td className="text-luxury-muted">{p.variants.length}</td>
                <td>{p.active ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
