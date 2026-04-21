import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");

  // Proteger rutas principales
  const protectedPaths = ["/campanas", "/clientes", "/contactos", "/enviados", "/facturacion", "/incidencias", "/plantillas", "/servicios"];
  if (protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Proteger APIs (excepto las rutas públicas)
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/track") &&
    !pathname.startsWith("/api/unsubscribe") &&
    !pathname.startsWith("/api/soporte")
  ) {
    if (!sessionToken) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  // Si ya está autenticado y va al login, redirigir al inicio
  if (pathname === "/login") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/campanas/:path*", "/clientes/:path*", "/contactos/:path*", "/enviados/:path*", "/facturacion/:path*", "/incidencias/:path*", "/plantillas/:path*", "/servicios/:path*", "/login", "/api/:path*"],
};
