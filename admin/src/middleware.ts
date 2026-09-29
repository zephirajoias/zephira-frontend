// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Função helper para decodificar JWT no Edge Runtime (sem bibliotecas externas)
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const COOKIE_TOKEN = "zephira_token_admin";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/esqueceu-senha", "/resete-senha"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 1. Caso: Não tem token e tenta acessar rota privada
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const payload = decodeJwt(token);
    const isExpired = payload?.exp ? Date.now() >= payload.exp * 1000 : true;

    // 2. Caso: Token expirado (ou ilegível). Apaga o cookie certo e deixa a
    // pessoa no login. Antes apagava outro nome ("zephira-token"): o cookie
    // vencido continuava, e o /login redirecionava pro /login sem fim
    // ("muitos redirecionamentos" no Safari, set/2026).
    if (isExpired) {
      const response = isPublicRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(COOKIE_TOKEN);
      return response;
    }

    // 3. Caso: Usuário logado tentando ir para Login/Register
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 4. Caso: Proteção de Rota Admin (Nível Pleno)
    // Se a rota começa com /admin e o usuário não é ADMIN, bloqueia
    if (pathname.startsWith("/admin") && payload?.roles !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url)); // Ou uma página de 403
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
