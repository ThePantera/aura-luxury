"use client";

import { Store, Truck } from "lucide-react";

export type ShippingValue = "RETIRO" | "ENVIO";

/** Sección 38: preparado para retiro o envío con costo fijo; el cálculo dinámico queda para más adelante. */
export function ShippingSelector({
  value,
  onChange,
  shippingCost,
}: {
  value: ShippingValue;
  onChange: (v: ShippingValue) => void;
  shippingCost: number;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onChange("RETIRO")}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors ${
          value === "RETIRO" ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold-light" : "border-white/15 text-luxury-muted hover:border-luxury-gold/40"
        }`}
      >
        <Store size={18} />
        <div className="text-left">
          <p className="font-medium">Retiro</p>
          <p className="text-xs opacity-70">Sin costo — coordinamos por WhatsApp.</p>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onChange("ENVIO")}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors ${
          value === "ENVIO" ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold-light" : "border-white/15 text-luxury-muted hover:border-luxury-gold/40"
        }`}
      >
        <Truck size={18} />
        <div className="text-left">
          <p className="font-medium">Envío a domicilio</p>
          <p className="text-xs opacity-70">
            {shippingCost > 0 ? `Costo fijo: $${shippingCost.toLocaleString("es-AR")}` : "A coordinar"}
          </p>
        </div>
      </button>
    </div>
  );
}
