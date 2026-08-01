"use client";

// #region agent log
// Temporary debug instrumentation (session 9bf674) — proves whether React
// hydration/mount actually happens on the failing device.
import { useEffect } from "react";
import { debugLog } from "@/lib/debugLog";

export function DebugProbe() {
  useEffect(() => {
    debugLog(
      "react-mounted",
      {
        href: window.location.href,
        matchMedia: typeof window.matchMedia === "function",
        io: typeof window.IntersectionObserver === "function",
        ro: typeof window.ResizeObserver === "function",
      },
      "A"
    );
  }, []);

  return null;
}
// #endregion
