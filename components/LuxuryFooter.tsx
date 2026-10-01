import Link from "next/link";

/** Footer (sección 52). Mercado Pago se menciona como "próximamente" a propósito. */
export function LuxuryFooter() {
  return (
    <footer className="border-t border-white/10 py-10 px-5 text-center text-[var(--color-muted)] text-xs">
      <p className="mb-3">AURA Luxury Fragrances</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-3">
        <Link href="/faq" className="hover:text-white">FAQ</Link>
        <Link href="/envios" className="hover:text-white">Envíos</Link>
        <Link href="/pagos" className="hover:text-white">Pagos</Link>
        <Link href="/cambios" className="hover:text-white">Cambios y devoluciones</Link>
        <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
        <Link href="/terminos" className="hover:text-white">Términos</Link>
      </div>
      <p>Pedidos coordinados por WhatsApp — pago online próximamente.</p>
      <p className="mt-2">© {new Date().getFullYear()} AURA Luxury Fragrances</p>
    </footer>
  );
}
