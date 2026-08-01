import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.tochkazreniya-clinic.ru";

/**
 * Sends every request that reaches this app on a non-canonical host
 * (bare "tochkazreniya-clinic.ru", any old Railway "*.up.railway.app"
 * URL, etc.) to the canonical https://www host. This only takes effect
 * once DNS for the bare domain actually points at this deployment —
 * see the DNS note below.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host && host !== CANONICAL_HOST) {
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
