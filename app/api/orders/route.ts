import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  items: z.array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  paymentMethod: z.enum(["TRANSFERENCIA", "MERCADO_PAGO"]),
  shippingMethod: z.enum(["RETIRO", "ENVIO"]),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    address: z.string().optional(),
    city: z.string().optional(),
  }),
});

const FIXED_SHIPPING_COST = 4500;

/**
 * Creación de pedido (sección 32/35/65). El precio, el stock y el descuento
 * se recalculan acá — nunca se confía en lo que mandó el navegador.
 * Mercado Pago se rechaza a propósito: todavía no hay integración real.
 */
export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de pedido inválidos." }, { status: 400 });
  }
  const { items, paymentMethod, shippingMethod, customer } = parsed.data;

  if (paymentMethod === "MERCADO_PAGO") {
    return NextResponse.json(
      { error: "Mercado Pago todavía no está disponible. Elegí transferencia bancaria." },
      { status: 501 }
    );
  }

  const session = await auth();
  const user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;

  // El modelo Order requiere un usuario (para poder aplicar el 20% y el
  // historial de "Mis pedidos"). El checkout como invitado sin cuenta
  // queda pendiente de decidir (TODO) -- hoy el pedido por WhatsApp
  // (checkout page) no pasa por acá y funciona sin login.
  if (!user) {
    return NextResponse.json({ error: "Necesitás iniciar sesión para registrar el pedido." }, { status: 401 });
  }

  try {
    // NOTA: `tx` queda como `any` solo en este entorno porque el cliente de
    // Prisma no se generó completo acá (sin acceso a binaries.prisma.sh).
    // Corriendo `npx prisma generate` con internet normal, se puede tipar
    // como `Prisma.TransactionClient` y TypeScript lo va a aceptar igual.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await prisma.$transaction(async (tx: any) => {
      let subtotal = 0;
      const orderItemsData: { variantId: string; quantity: number; unitPrice: number }[] = [];

      for (const line of items) {
        const variant = await tx.productVariant.findUniqueOrThrow({ where: { id: line.variantId } });
        const activeReservations = await tx.stockReservation.aggregate({
          where: { variantId: line.variantId, expiresAt: { gt: new Date() } },
          _sum: { quantity: true },
        });
        const available = variant.stock - (activeReservations._sum.quantity ?? 0);
        if (available < line.quantity) {
          throw new Error(`Stock insuficiente para una de las variantes seleccionadas.`);
        }
        subtotal += Number(variant.price) * line.quantity;
        orderItemsData.push({ variantId: line.variantId, quantity: line.quantity, unitPrice: Number(variant.price) });
      }

      const hasDiscount = user?.firstPurchaseDiscount === "AVAILABLE";
      const discount = hasDiscount ? subtotal * 0.2 : 0;
      const shippingCost = shippingMethod === "ENVIO" ? FIXED_SHIPPING_COST : 0;
      const total = subtotal - discount + shippingCost;

      const orderCount = await tx.order.count();
      const publicNumber = `AUR-${1000 + orderCount}`;

      const createdOrder = await tx.order.create({
        data: {
          publicNumber,
          userId: user.id,
          status: "PENDIENTE",
          paymentMethod,
          subtotal,
          discount,
          shippingCost,
          total,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          items: { create: orderItemsData },
          statusHistory: { create: { status: "PENDIENTE" } },
        },
      });

      for (const line of orderItemsData) {
        await tx.stockReservation.create({
          data: {
            variantId: line.variantId,
            orderId: createdOrder.id,
            quantity: line.quantity,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          },
        });
      }

      if (hasDiscount && user) {
        await tx.user.update({ where: { id: user.id }, data: { firstPurchaseDiscount: "RESERVED" } });
      }

      return createdOrder;
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No pudimos crear el pedido." },
      { status: 400 }
    );
  }
}
