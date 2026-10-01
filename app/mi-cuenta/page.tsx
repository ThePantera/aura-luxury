import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MiCuentaPage() {
  const session = await auth();
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  return (
    <section className="max-w-2xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-luxury-warm mb-6">Mi cuenta</h1>

      {user && (
        <div className="p-5 rounded-2xl bg-luxury-surface border border-white/10 mb-6">
          <p className="text-sm text-luxury-warm font-medium">{user.name}</p>
          <p className="text-xs text-luxury-muted">{user.email} · @{user.username}</p>
          <p className="text-xs mt-2">
            <span className="text-luxury-gold-light">20% primera compra: </span>
            <span className="text-luxury-muted">{user.firstPurchaseDiscount}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link href="/mi-cuenta/pedidos" className="p-4 rounded-xl border border-white/10 bg-luxury-surface text-sm text-luxury-warm hover:border-luxury-gold/40">
          Mis pedidos
        </Link>
        <Link href="/mi-cuenta/reviews" className="p-4 rounded-xl border border-white/10 bg-luxury-surface text-sm text-luxury-warm hover:border-luxury-gold/40">
          Mis reseñas
        </Link>
      </div>
    </section>
  );
}
