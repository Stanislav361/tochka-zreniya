import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// #region agent log
import { sinkPush } from "@/lib/debugSink";
// #endregion

/**
 * The bare domain — not "www" — is canonical on purpose. The zone's
 * authoritative servers answer the "www" name with rcode NXDOMAIN even though
 * they do hand out its CNAME, so any resolver that honours the rcode (mobile
 * carriers among them) decides the name does not exist. Those devices then
 * cannot follow a redirect pointing at "www", which is what left phones on a
 * blank screen. The bare name is a plain A record and resolves everywhere.
 */
const CANONICAL_HOST = "tochkazreniya-clinic.ru";

/**
 * Sends every request that reaches this app on a non-canonical host
 * (the "www" name, any old Railway "*.up.railway.app" URL, etc.) to the
 * canonical https host.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const path = request.nextUrl.pathname;

  // #region agent log
  const ua = request.headers.get("user-agent") || "";
  sinkPush("server", {
    sessionId: "9bf674",
    runId: "run2",
    hypothesisId: "G",
    location: "proxy.ts",
    message: "request",
    data: {
      host,
      path: path.slice(0, 120),
      search: request.nextUrl.search.slice(0, 60),
      ua: ua.slice(0, 160),
      proto: request.headers.get("x-forwarded-proto"),
      accept: (request.headers.get("accept") || "").slice(0, 60),
      acceptEncoding: request.headers.get("accept-encoding"),
      ifNoneMatch: request.headers.get("if-none-match"),
      purpose: request.headers.get("purpose") || request.headers.get("sec-purpose"),
    },
    timestamp: Date.now(),
  });
  // Diagnostic pages must answer on whatever host the device actually reached,
  // otherwise the redirect hides which hop is failing.
  if (path === "/api/ping" || path === "/api/debug-log" || path === "/api/diag") {
    return NextResponse.next();
  }
  // #endregion

  if (host && host !== CANONICAL_HOST) {
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // #region agent log
  // Widened from the usual exclusion list so asset requests are logged too —
  // that shows whether a device downloaded the JS/CSS chunks at all.
  matcher: ["/:path*"],
  // #endregion
};
