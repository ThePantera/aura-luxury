interface WhatsAppItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface WhatsAppOrderPayload {
  publicNumber: string;
  items: WhatsAppItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customer: { name: string; email: string; phone: string; address?: string; city?: string };
}

/** Arma el texto del pedido (sección 31). Los montos deben llegar ya validados. */
export function buildWhatsAppMessage(order: WhatsAppOrderPayload): string {
  const lines = [
    "AURA LUXURY",
    `Pedido ${order.publicNumber}`,
    "",
    ...order.items.map(
      (i) => `${i.name}\nCantidad: ${i.quantity}\nPrecio: $${(i.unitPrice * i.quantity).toLocaleString("es-AR")}`
    ),
    "",
    `Subtotal: $${order.subtotal.toLocaleString("es-AR")}`,
    `Descuento: -$${order.discount.toLocaleString("es-AR")}`,
    `Envío: $${order.shipping.toLocaleString("es-AR")}`,
    `TOTAL: $${order.total.toLocaleString("es-AR")}`,
    "",
    "Cliente:",
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    [order.customer.address, order.customer.city].filter(Boolean).join(", "),
  ];
  return encodeURIComponent(lines.join("\n"));
}

export function buildWhatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "";
  return `https://wa.me/${phone}?text=${message}`;
}
