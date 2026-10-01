"use client";

import { CreditCard, Banknote } from "lucide-react";

export type PaymentMethodValue = "TRANSFERENCIA" | "MERCADO_PAGO";

/**
 * Selector de método de pago (sección 32-34).
 * Mercado Pago queda deshabilitado hasta tener credenciales reales
 * (MERCADOPAGO_ACCESS_TOKEN) y la integración del lado del servidor —
 * no se simula un pago aprobado bajo ninguna circunstancia.
 */
export function PaymentSelector({
  value,
  onChange,
}: {
  value: PaymentMethodValue;
  onChange: (v: PaymentMethodValue) => void;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onChange("TRANSFERENCIA")}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors ${
          value === "TRANSFERENCIA"
            ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold-light"
            : "border-white/15 text-luxury-muted hover:border-luxury-gold/40"
        }`}
      >
        <Banknote size={18} />
        <div className="text-left">
          <p className="font-medium">Transferencia bancaria</p>
          <p className="text-xs opacity-70">Pedido queda PENDIENTE hasta que administración confirme la transferencia.</p>
        </div>
      </button>

      <div
        aria-disabled
        className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 text-sm text-luxury-muted opacity-50 cursor-not-allowed"
      >
        <CreditCard size={18} />
        <div className="text-left">
          <p className="font-medium">Mercado Pago</p>
          <p className="text-xs">Todavía no disponible — falta definir la integración con el proveedor de pagos.</p>
        </div>
      </div>
    </div>
  );
}
