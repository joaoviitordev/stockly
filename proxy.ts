import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const protectedRoutes = ["/dashboard", "/products", "/sales"];
const authRoutes = ["/login", "/register"];

async function decryptSession(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  // Lê o cookie de sessão diretamente do request
  const cookie = req.cookies.get("session")?.value;
  const session = await decryptSession(cookie);

  // Redireciona para login se não autenticado tentando acessar rota protegida
  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redireciona para dashboard se já autenticado tentando acessar login/register
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|.*\\.svg$|.*\\.png$).*)",
  ],
};
