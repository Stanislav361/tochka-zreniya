"use client";

import { ScrollRevealText } from "./ScrollRevealText";

/**
 * Full-bleed statement band: a single sentence that lights up as it passes
 * through the viewport, sitting over a bioluminescent light pool.
 */
export function StatementSection({
  children,
  glowSide = "center",
}: {
  children: React.ReactNode;
  glowSide?: "left" | "center" | "right";
}) {
  const glowPosition =
    glowSide === "left"
      ? "left-[6%]"
      : glowSide === "right"
        ? "right-[6%]"
        : "left-1/2 -translate-x-1/2";

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className={`glow-pool bottom-[-12%] h-[420px] w-[560px] ${glowPosition}`} />
      <div className="relative mx-auto max-w-5xl px-6">
        <ScrollRevealText>{children}</ScrollRevealText>
      </div>
    </section>
  );
}
