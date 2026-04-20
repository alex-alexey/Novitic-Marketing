import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");

  // Proteger rutas del dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Proteger APIs (excepto /api/auth, /api/track y /api/unsubscribe que son públicas)
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/track") &&
    !pathname.startsWith("/api/unsubscribe")
  ) {
    if (!sessionToken) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  // Si ya está autenticado y va al login, redirigir al dashboard
  if (pathname === "/login") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
};
