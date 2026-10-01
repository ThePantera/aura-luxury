// NOTA: se usa una interfaz local en vez de Prisma.XGetPayload porque en
// este entorno el cliente de Prisma no pudo generarse completo (sin acceso
// a binaries.prisma.sh). Con `npx prisma generate` corriendo con internet
// normal, se puede reemplazar por el tipo generado real si se prefiere.
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";

interface OrderItemWithVariant {
  variant: { productId: string };
}
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  orderId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(1).max(500),
  recommends: z.boolean(),
});

/** Solo quien compró el producto puede reseñarlo (sección 21). Entra PENDIENTE. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Necesitás iniciar sesión." }, { status: 401 });
  }

  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de reseña inválidos." }, { status: 400 });
  }
  const { productId, orderId, rating, title, comment, recommends } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id, status: { in: ["ENTREGADO", "ENVIADO"] } },
    include: { items: { include: { variant: true } } },
  });
  const purchasedThisProduct = order?.items.some(
    (i: OrderItemWithVariant) => i.variant.productId === productId
  );

  if (!order || !purchasedThisProduct) {
    return NextResponse.json({ error: "Solo podés reseñar productos que hayas comprado." }, { status: 403 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      orderId,
      rating,
      title: title ?? "",
      comment,
      wouldRecommend: recommends,
      verifiedPurchase: true,
      status: "PENDIENTE",
    },
  });

  return NextResponse.json({ data: review }, { status: 201 });
}
