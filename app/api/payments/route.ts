import { NextResponse } from "next/server";

/**
 * Preparado para Mercado Pago (sección 33). Devuelve 501 a propósito hasta
 * tener MERCADOPAGO_ACCESS_TOKEN y la integración real del lado del servidor.
 * No simular un pago aprobado bajo ninguna circunstancia (sección 77-78).
 */
export async function POST() {
  return NextResponse.json(
    { error: "El pago con Mercado Pago todavía no está disponible en esta tienda." },
    { status: 501 }
  );
}
