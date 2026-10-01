"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/categoria/hombre", label: "Hombre" },
  { href: "/categoria/mujer", label: "Mujer" },
  { href: "/categoria/unisex", label: "Unisex" },
  { href: "/categoria/nicho", label: "Niche" },
];

/** Navbar premium (sección 10): cambia de tamaño/opacidad al hacer scroll. */
export function LuxuryNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const count = items.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-black/90 py-3" : "bg-black/60 py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="font-brand font-bold tracking-[0.15em] text-luxury-gold-light text-xl">
          AURA
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wide text-luxury-muted">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-luxury-warm">
          <button aria-label="Buscar" className="hover:text-luxury-gold transition-colors">
            <Search size={18} />
          </button>
          <Link href="/mi-cuenta" aria-label="Mi cuenta" className="hover:text-luxury-gold transition-colors">
            <User size={18} />
          </Link>
          <Link href="/checkout" aria-label="Carrito" className="relative hover:text-luxury-gold transition-colors">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold-light text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Menú"
            className="md:hidden hover:text-luxury-gold transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden px-5 pt-4 pb-2 flex flex-col gap-3 text-sm text-luxury-muted">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
