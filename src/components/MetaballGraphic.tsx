"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NODES = [
  { x: 70, y: 70 },
  { x: 200, y: 70 },
  { x: 330, y: 70 },
  { x: 70, y: 185 },
  { x: 200, y: 185 },
  { x: 330, y: 185 },
  { x: 70, y: 300 },
  { x: 200, y: 300 },
  { x: 330, y: 300 },
];

// Blobs travel between grid nodes; the goo filter fuses them into peanut
// shapes whenever they pass close to a static node.
const BLOBS = [
  { from: { x: 70, y: 70 }, to: { x: 135, y: 128 }, duration: 5.5, delay: 0 },
  { from: { x: 330, y: 185 }, to: { x: 265, y: 185 }, duration: 4.6, delay: 0.8 },
  { from: { x: 200, y: 300 }, to: { x: 135, y: 243 }, duration: 6.2, delay: 1.6 },
  { from: { x: 200, y: 70 }, to: { x: 200, y: 128 }, duration: 7, delay: 2.4 },
];

export function MetaballGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 370"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
        </filter>
        <radialGradient id="nodeFill" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e3f6f4" />
        </radialGradient>
      </defs>

      {/* faint instrument dot grid */}
      <g opacity="0.22">
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 10 }).map((__, col) => (
            <circle
              key={`${row}-${col}`}
              cx={12 + col * 42}
              cy={14 + row * 42}
              r="1.1"
              fill="#7fbdb8"
            />
          ))
        )}
      </g>

      <g filter="url(#goo)">
        {NODES.map((node) => (
          <circle key={`${node.x}-${node.y}`} cx={node.x} cy={node.y} r="19" fill="url(#nodeFill)" />
        ))}

        {BLOBS.map((blob, i) => (
          <motion.circle
            key={i}
            r="16"
            fill="#eafffd"
            initial={{ cx: blob.from.x, cy: blob.from.y }}
            animate={{
              cx: [blob.from.x, blob.to.x, blob.from.x],
              cy: [blob.from.y, blob.to.y, blob.from.y],
            }}
            transition={{
              duration: blob.duration,
              delay: blob.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>

      {/* crisp pupil dots sit above the fused surface */}
      {NODES.map((node) => (
        <circle
          key={`dot-${node.x}-${node.y}`}
          cx={node.x}
          cy={node.y}
          r="2.1"
          fill="#01312e"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}
