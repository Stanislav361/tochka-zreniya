"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { statsBento } from "@/data/clinicData";
import { AnimatedSection } from "./AnimatedSection";
import { cn } from "@/lib/utils";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // positive rootMargin + low amount: on phones a -80px margin never hit the
  // number at the bottom of a tall card, so counters stayed stuck at 0
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "120px 0px" });

  const decimals = value.includes(".") ? 1 : 0;
  const target = Number.parseFloat(value);
  const [display, setDisplay] = useState(() =>
    (0).toFixed(decimals).replace(".", ",")
  );

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finalValue = target.toFixed(decimals).replace(".", ",");
    let frame = 0;

    if (reduceMotion) {
      frame = requestAnimationFrame(() => setDisplay(finalValue));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((target * eased).toFixed(decimals).replace(".", ","));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, decimals]);

  return <span ref={ref}>{display}</span>;
}

export function StatsBento() {
  return (
    <section id="stats" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool right-[-5%] top-[10%] h-[400px] w-[500px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="u-label text-mist/70">Цифры</p>
          <h2 className="display-tight mt-4 text-[1.75rem] text-platinum sm:text-[2.4rem]">
            «Точка Зрения» в цифрах
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-silver">
            Офтальмология, детский приём, аппаратное лечение и оптика — четыре направления
            в одном медицинском центре.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {statsBento.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex flex-col justify-between rounded-cards p-6 sm:p-9",
                stat.featured
                  ? "min-h-[220px] text-abyss sm:min-h-[280px] lg:row-span-2 lg:min-h-[420px]"
                  : "min-h-[160px] bg-kelp sm:min-h-[200px]",
                i === 1 && "lg:col-span-3"
              )}
              style={
                stat.featured
                  ? {
                      background:
                        "linear-gradient(170deg, rgb(203,255,252) 0%, rgb(247,236,255) 45%, rgb(255,253,250) 100%)",
                    }
                  : undefined
              }
            >
              <p
                className={cn(
                  "u-label-sm max-w-[16ch] leading-relaxed",
                  stat.featured ? "text-abyss/70" : "text-mist/80"
                )}
              >
                {stat.label}
              </p>
              <p
                className={cn(
                  "kinetic mt-8 text-[2.8rem] sm:mt-10 sm:text-[4.2rem]",
                  stat.featured ? "text-abyss" : "text-phosphor"
                )}
              >
                <CountUp value={stat.value} />
                <span className="text-[0.5em] tracking-normal">{stat.suffix}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
