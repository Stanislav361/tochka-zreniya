import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// #region agent log
import { sinkPush } from "@/lib/debugSink";
// #endregion

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
  if (path === "/api/ping" || path === "/api/debug-log") {
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
