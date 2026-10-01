"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CheckoutForm, type CheckoutFormValues } from "@/components/CheckoutForm";
import { PaymentSelector, type PaymentMethodValue } from "@/components/PaymentSelector";
import { ShippingSelector, type ShippingValue } from "@/components/ShippingSelector";
import { buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const FIXED_SHIPPING_COST = 4500;

function formatPrice(value: number) {
  return value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default function CheckoutPage() {
  const { items, changeQuantity, removeItem, subtotal, clear } = useCart();
  const [payment, setPayment] = useState<PaymentMethodValue>("TRANSFERENCIA");
  const [shippingMethod, setShippingMethod] = useState<ShippingValue>("RETIRO");
  const [formValues, setFormValues] = useState<CheckoutFormValues | null>(null);

  // TODO: reemplazar por el 20% real segun el estado del usuario logueado
  // (AVAILABLE/RESERVED/USED) una vez conectada la autenticación (sección 27-29).
  const hasDiscount = false;
  const discount = hasDiscount ? subtotal * 0.2 : 0;
  const shippingCost = shippingMethod === "ENVIO" ? FIXED_SHIPPING_COST : 0;
  const total = subtotal - discount + shippingCost;

  function handleWhatsAppCheckout() {
    if (!formValues) {
      (document.getElementById("checkout-form") as HTMLFormElement | null)?.requestSubmit();
      return;
    }
    if (items.length === 0) return;

    // Numero provisorio en el cliente -- el backend real (POST /api/orders)
    // es quien asigna el numero definitivo cuando la base de datos esté conectada.
    const publicNumber = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const message = buildWhatsAppMessage({
      publicNumber,
      items: items.map((i) => ({ name: `${i.brand} ${i.name} (${i.volumeMl}ml)`, quantity: i.quantity, unitPrice: i.unitPrice })),
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      customer: { ...formValues },
    });
    window.open(buildWhatsAppLink(message), "_blank");
  }

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-luxury-warm mb-3">Tu carrito está vacío</h1>
        <p className="text-sm text-luxury-muted">Agregá algún perfume del catálogo para continuar con tu pedido.</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-luxury-warm mb-8">Checkout</h1>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center gap-3 p-3 rounded-xl bg-luxury-surface border border-white/10">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-grow">
              <p className="text-xs uppercase tracking-widest text-luxury-gold">{item.brand}</p>
              <p className="text-sm text-luxury-warm">{item.name} · {item.volumeMl}ml</p>
              <p className="text-xs text-luxury-gold-light">{formatPrice(item.unitPrice)}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-luxury-warm">
              <button onClick={() => changeQuantity(item.variantId, -1)} className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center hover:border-luxury-gold">
                <Minus size={12} />
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQuantity(item.variantId, 1)} className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center hover:border-luxury-gold">
                <Plus size={12} />
              </button>
              <button onClick={() => removeItem(item.variantId)} className="ml-2 text-luxury-muted hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-lg text-luxury-warm mb-3">Tus datos</h2>
          <CheckoutForm onValid={(values) => { setFormValues(values); handleWhatsAppCheckout(); }} />

          <h2 className="font-display text-lg text-luxury-warm mt-6 mb-3">Entrega</h2>
          <ShippingSelector value={shippingMethod} onChange={setShippingMethod} shippingCost={FIXED_SHIPPING_COST} />

          <h2 className="font-display text-lg text-luxury-warm mt-6 mb-3">Método de pago</h2>
          <PaymentSelector value={payment} onChange={setPayment} />
        </div>

        <div className="p-5 rounded-2xl bg-luxury-surface border border-white/10 h-fit">
          <h2 className="font-display text-lg text-luxury-warm mb-4">Resumen</h2>
          <div className="space-y-1 text-sm text-luxury-muted">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {hasDiscount && (
              <div className="flex justify-between text-luxury-gold-light"><span>Descuento (20%)</span><span>-{formatPrice(discount)}</span></div>
            )}
            <div className="flex justify-between"><span>Envío</span><span>{shippingCost > 0 ? formatPrice(shippingCost) : "Sin cargo"}</span></div>
            <div className="flex justify-between text-lg font-semibold text-luxury-warm pt-2 border-t border-white/10 mt-2">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={handleWhatsAppCheckout}
            className="w-full mt-5 py-3 rounded-full bg-[#2e7d4f] hover:bg-[#35935c] text-white font-semibold text-sm transition-colors"
          >
            Confirmar pedido por WhatsApp
          </button>
          <p className="text-[11px] text-luxury-muted text-center mt-3">
            El pago con Mercado Pago se habilita cuando esté definida la integración con la empresa de pagos.
            Por ahora, todo pedido se confirma por WhatsApp o transferencia bancaria con verificación manual.
          </p>
        </div>
      </div>
    </section>
  );
}
