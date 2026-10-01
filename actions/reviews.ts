"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Server Actions de moderación (sección 22/44). La autorización se repite
 * acá adentro -- nunca confiar en que solo un admin pudo llegar a este botón.
 */
async function assertAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") throw new Error("No autorizado.");
}

export async function publishReview(reviewId: string) {
  await assertAdmin();
  await prisma.review.update({ where: { id: reviewId }, data: { status: "PUBLICADA" } });
  revalidatePath("/admin/reviews");
}

export async function rejectReview(reviewId: string) {
  await assertAdmin();
  await prisma.review.update({ where: { id: reviewId }, data: { status: "RECHAZADA" } });
  revalidatePath("/admin/reviews");
}
