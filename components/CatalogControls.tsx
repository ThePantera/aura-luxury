"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Buscador con debounce (sección 13) y orden. Actualiza la URL para que
 * el listado (Server Component) se re-renderice con los nuevos filtros.
 */
export function CatalogControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      router.replace(`${pathname}?${params.toString()}`);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "relevancia") params.delete("sort");
    else params.set("sort", e.target.value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar marca, nombre o concentración"
        className="rounded-full px-4 py-2.5 text-sm flex-grow md:flex-grow-0 md:w-72 bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
      />
      <select
        defaultValue={searchParams.get("sort") ?? "relevancia"}
        onChange={handleSort}
        className="rounded-full px-4 py-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm focus:outline-none focus:border-luxury-gold"
      >
        <option value="relevancia">Relevancia</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
        <option value="novedades">Novedades</option>
        <option value="mejor-valorados">Mejor valorados</option>
      </select>
      {/* TODO: ProductFilters (género, marca, concentración, volumen, precio) — sección 13 */}
    </div>
  );
}
