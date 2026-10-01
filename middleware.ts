import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Protege /admin y /mi-cuenta en el edge (sección 39/45). Es solo UX:
 * la autorización real debe repetirse en cada route handler de /api/admin/*.
 */
export default auth((req) => {
  const role = (req.auth?.user as { role?: string } | undefined)?.role;
  const { pathname } = req.nextUrl;

  if (!req.auth && (pathname.startsWith("/admin") || pathname.startsWith("/mi-cuenta"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = { matcher: ["/admin/:path*", "/mi-cuenta/:path*"] };
