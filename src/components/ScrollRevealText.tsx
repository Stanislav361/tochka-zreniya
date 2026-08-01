"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Statement headline whose colour sweeps diagonally from muted teal into
 * mist-white and lavender-phosphor as the block travels through the viewport.
 * The sweep edge position is driven by scroll progress through a CSS variable.
 */
export function ScrollRevealText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.42"],
  });
  const reveal = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ ["--reveal" as string]: reveal }}
      className={cn(
        "kinetic text-center text-[1.65rem] leading-[1.15] sm:text-[3rem] sm:leading-none lg:text-[3.8rem]",
        "bg-clip-text text-transparent",
        className
      )}
    >
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(72deg," +
            " rgba(120, 196, 190, 0.34) 0%," +
            " rgba(120, 196, 190, 0.34) calc((1 - var(--reveal)) * 122%)," +
            " #edfffe calc((1 - var(--reveal)) * 122% + 16%)," +
            " #fde9ff 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}
