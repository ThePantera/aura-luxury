import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

/**
 * Registro con cuenta propia (sección 23-24). No se pide DNI.
 * El email queda UNVERIFIED hasta confirmar el token — el envío real del
 * mail (SMTP / proveedor transaccional) queda como TODO técnico (sección 77).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de registro inválidos." }, { status: 400 });
  }
  const { name, username, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    return NextResponse.json({ error: "Ese email o usuario ya está registrado." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, username, email, passwordHash, role: "CLIENT", emailStatus: "UNVERIFIED" },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: user.email, token, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });

  // TODO: enviar email real con el link de verificación (`/verificar-email?token=...`)
  // una vez que exista un proveedor transaccional configurado (Resend, SES, etc.)
  console.log(`[dev] Link de verificación para ${email}: /verificar-email?token=${token}`);

  return NextResponse.json({ data: { id: user.id } }, { status: 201 });
}
