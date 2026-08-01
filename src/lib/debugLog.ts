// #region agent log
// Temporary debug instrumentation (session 9bf674) — remove with /api/debug-log.
export function debugLog(
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string
) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    sessionId: "9bf674",
    runId: "run1",
    hypothesisId,
    location: "client",
    message,
    data,
    timestamp: Date.now(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/debug-log", new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    // fall through to fetch
  }
  fetch("/api/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
// #endregion
