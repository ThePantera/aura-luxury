import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API real contra la base de datos (sección 58). El catálogo público hoy
 * renderiza desde services/product-service.ts (mock) hasta importar datos
 * reales — este endpoint ya apunta a Prisma para cuando eso pase.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get("genero");
  const search = searchParams.get("q");

  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(gender ? { gender: gender as any } : {}),
        ...(search
          ? { OR: [{ brand: { contains: search, mode: "insensitive" } }, { name: { contains: search, mode: "insensitive" } }] }
          : {}),
      },
      include: { images: true, variants: true },
    });
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No pudimos cargar el catálogo." }, { status: 500 });
  }
}
