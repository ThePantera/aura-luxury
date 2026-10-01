"use client";

import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  variantId: string;
  productSlug: string;
  brand: string;
  name: string;
  volumeMl: number;
  presentation: string;
  unitPrice: number; // solo para UI — el backend recalcula al crear el pedido (sección 65)
  image: string | null;
  quantity: number;
  maxStock: number;
}

const STORAGE_KEY = "aura_cart";

/** Carrito en el cliente (sección 30). Es solo UX. */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* localStorage no disponible: carrito vacío para esta sesión */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + item.quantity, existing.maxStock);
        return prev.map((i) => (i.variantId === item.variantId ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, item];
    });
  }, []);

  const changeQuantity = useCallback((variantId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.variantId === variantId
            ? { ...i, quantity: Math.min(i.quantity + delta, i.maxStock) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  return { items, hydrated, addItem, changeQuantity, removeItem, clear, subtotal };
}
