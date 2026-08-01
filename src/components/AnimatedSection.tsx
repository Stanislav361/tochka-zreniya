"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  as: Component = "div",
  variants,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
  variants?: Variants;
}) {
  const MotionComponent = Component === "section" ? motion.section : motion.div;
  return (
    <MotionComponent
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      variants={variants ?? defaultVariants}
    >
      {children}
    </MotionComponent>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
