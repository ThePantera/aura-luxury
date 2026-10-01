# AURA Luxury Fragrances

E-commerce de perfumería premium. Next.js 16 (App Router) + TypeScript + Tailwind v4 + Prisma/PostgreSQL + Auth.js.

## Setup

```bash
npm install
cp .env.example .env      # completar las variables (ver abajo)
npx prisma migrate dev    # crea las tablas en tu base PostgreSQL
npm run dev
```

Abrí http://localhost:3000

## Variables de entorno

Ver `.env.example`. Notas importantes:

- **`DATABASE_URL`**: PostgreSQL. Sin esto, `npx prisma migrate dev` falla.
- **`AUTH_SECRET`**: cualquier string random largo (`openssl rand -base64 32`).
- **`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`**: para el login con Google. Sin esto, ese botón no funciona (no lo simules con valores falsos).
- **`MERCADOPAGO_ACCESS_TOKEN`**: **dejar vacío a propósito.** El pago con Mercado Pago está deshabilitado en todo el código (`app/api/payments`, `PaymentSelector`) hasta que la empresa de pagos esté definida. No completar con credenciales de prueba para "que funcione": el master spec prohíbe simular pagos aprobados.
- **`NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER`**: número real de la tienda, formato internacional sin `+` (ej. `5491122334455`).

## Qué está implementado

- **Catálogo público** (`/`, `/catalogo`, `/categoria/[slug]`, `/producto/[slug]`): corre hoy sobre **datos mock** (`lib/mock-data.ts`), claramente marcados como no-reales (sección 78 del spec). El catálogo real "Diseñador Hombre" todavía no se importó a la base de datos.
- **Carrito** (`hooks/useCart.ts`): client-side con `localStorage`.
- **Checkout** (`/checkout`): funciona hoy por **WhatsApp** (mensaje con número de pedido, subtotal, descuento y total). El método "transferencia bancaria" queda pendiente de verificación manual por admin.
- **Mercado Pago**: **deshabilitado a propósito.** `PaymentSelector` lo muestra bloqueado, `POST /api/payments` responde `501`, y `POST /api/orders` rechaza `paymentMethod: MERCADO_PAGO`.
- **Autenticación** (Auth.js v5): Google OAuth + email/contraseña con hash (`bcryptjs`), verificación de email pendiente de token (el envío real de mail queda TODO — no hay proveedor transaccional configurado).
- **Roles**: `CLIENT` / `ADMIN`. El registro público siempre crea `CLIENT`; `ADMIN` se asigna a mano en la base de datos.
- **Panel admin** (`/admin`, protegido por `middleware.ts` + verificación de rol en cada Server Component): dashboard con métricas reales de la base, listado de productos/usuarios/pedidos, y moderación de reseñas (aprobar/rechazar) con Server Actions.
- **Pedidos** (`POST /api/orders`): recalcula precio, stock y descuento en el backend — nunca confía en lo que mandó el navegador. Reserva stock con expiración de 15 minutos. Requiere que el cliente tenga cuenta (el checkout como invitado sin cuenta queda como decisión pendiente).
- **Reviews** (`POST /api/reviews`): solo quien compró el producto puede reseñarlo; toda reseña nueva entra `PENDIENTE` y no afecta el promedio hasta que un admin la publica.

## Qué falta (a propósito, según el spec)

- Importar el catálogo real "Diseñador Hombre" a Prisma y apagar `lib/mock-data.ts`. El catálogo "Diseñador Mujer" **no cargar todavía** — precios en revisión (sección 62).
- Definir la empresa de pagos y activar Mercado Pago (`services` / `app/api/payments`).
- Envío real de emails (verificación de cuenta, recuperación de contraseña).
- `ProductFilters` completo (marca, concentración, volumen, precio) — hoy solo hay búsqueda + orden.
- CRUD completo en `/admin/productos` (crear/editar/pausar/soft-delete).
- Cron / route handler para liberar reservas de stock vencidas (`releaseExpiredReservations`, a escribir).
- SEO avanzado (sitemap, datos estructurados de producto), Fragrance Finder real, Instagram, Newsletter.

## Nota sobre versiones

Este proyecto quedó scaffoldeado con **Next.js 16 / React 19 / Tailwind v4 / NextAuth v5 beta** — versiones más nuevas que las que mucha documentación asume. Revisá `AGENTS.md` (autogenerado por `next dev`) antes de asumir convenciones de versiones anteriores de Next.js.
