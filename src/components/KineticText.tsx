"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Section-spanning oversized display text. Two lines drift horizontally in
 * opposite directions as the section scrolls past — text as environment.
 */
export function KineticText({
  lineOne,
  lineTwo,
}: {
  lineOne: string;
  lineTwo: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const xOne = useTransform(scrollYProgress, [0, 1], ["8%", "-32%"]);
  const xTwo = useTransform(scrollYProgress, [0, 1], ["-26%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.35, 1, 1, 0.35]);

  return (
    <div ref={ref} className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool left-[10%] top-1/3 h-[380px] w-[520px]" />
      <motion.div style={{ opacity }} className="relative flex flex-col gap-2">
        <motion.div
          style={{ x: xOne }}
          className="kinetic whitespace-nowrap text-[19vw] leading-[0.86] text-transparent bg-clip-text"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #bbc7c6 0%, #edfffe 45%, #fde9ff 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            {lineOne}
          </span>
        </motion.div>
        <motion.div
          style={{ x: xTwo }}
          className="kinetic whitespace-nowrap text-[19vw] leading-[0.86]"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #fde9ff 0%, #edfffe 40%, rgba(187,199,198,0.75) 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            {lineTwo}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
