"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ITEM_H = 40;
const VISIBLE = 5;
const PAD = Math.floor(VISIBLE / 2);

const HOURS = Array.from({ length: 11 }, (_, i) => String(10 + i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

type TimeWheelProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function TimeWheel({ value, onChange, className }: TimeWheelProps) {
  const [hour = "10", minute = "00"] = value ? value.split(":") : ["10", "00"];

  function commit(nextHour: string, nextMinute: string) {
    onChange(`${nextHour}:${nextMinute}`);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-small border border-white/10 bg-white/[0.03]",
        className
      )}
      style={{ height: ITEM_H * VISIBLE }}
    >
      {/* center selection capsule */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-3 z-10 rounded-full bg-white/10"
        style={{ top: ITEM_H * PAD, height: ITEM_H }}
      />
      {/* fade masks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-14"
        style={{
          background: "linear-gradient(to bottom, rgba(1,29,28,0.95), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14"
        style={{
          background: "linear-gradient(to top, rgba(1,29,28,0.95), transparent)",
        }}
      />

      <div className="relative z-0 grid h-full grid-cols-2">
        <WheelColumn
          items={HOURS}
          value={hour}
          onChange={(h) => commit(h, minute)}
          ariaLabel="Часы"
        />
        <WheelColumn
          items={MINUTES}
          value={minute}
          onChange={(m) => commit(hour, m)}
          ariaLabel="Минуты"
        />
      </div>
    </div>
  );
}

function WheelColumn({
  items,
  value,
  onChange,
  ariaLabel,
}: {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolling = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the drum aligned when the controlled value changes from outside.
  useEffect(() => {
    const el = ref.current;
    if (!el || scrolling.current) return;
    const index = Math.max(0, items.indexOf(value));
    const top = index * ITEM_H;
    if (Math.abs(el.scrollTop - top) > 1) {
      el.scrollTop = top;
    }
  }, [value, items]);

  function settle() {
    const el = ref.current;
    if (!el) return;
    const index = Math.min(
      items.length - 1,
      Math.max(0, Math.round(el.scrollTop / ITEM_H))
    );
    const next = items[index];
    const top = index * ITEM_H;
    if (Math.abs(el.scrollTop - top) > 0.5) {
      el.scrollTo({ top, behavior: "smooth" });
    }
    if (next !== value) onChange(next);
    scrolling.current = false;
  }

  function onScroll() {
    scrolling.current = true;
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 80);
  }

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={onScroll}
      className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div style={{ height: ITEM_H * PAD }} aria-hidden />
      {items.map((item) => {
        const selected = item === value;
        return (
          <button
            key={item}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => {
              onChange(item);
              ref.current?.scrollTo({
                top: items.indexOf(item) * ITEM_H,
                behavior: "smooth",
              });
            }}
            className={cn(
              "flex w-full snap-center items-center justify-center font-medium tabular-nums transition-[opacity,transform,color]",
              selected ? "scale-110 text-platinum" : "scale-90 text-slate-deep"
            )}
            style={{ height: ITEM_H }}
          >
            {item}
          </button>
        );
      })}
      <div style={{ height: ITEM_H * PAD }} aria-hidden />
    </div>
  );
}
