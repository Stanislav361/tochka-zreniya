"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { statsBento } from "@/data/clinicData";
import { AnimatedSection } from "./AnimatedSection";
import { cn } from "@/lib/utils";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const decimals = value.includes(".") ? 1 : 0;
  const target = parseFloat(value);

  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (latest) =>
    latest.toFixed(decimals).replace(".", ",")
  );

  useEffect(() => {
    if (inView) raw.set(target);
  }, [inView, raw, target]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

export function StatsBento() {
  return (
    <section id="stats" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool right-[-5%] top-[10%] h-[400px] w-[500px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="u-label text-mist/70">Цифры</p>
          <h2 className="display-tight mt-4 text-[2rem] text-platinum sm:text-[2.4rem]">
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
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex flex-col justify-between rounded-cards p-8 sm:p-9",
                stat.featured
                  ? "min-h-[280px] text-abyss lg:row-span-2 lg:min-h-[420px]"
                  : "min-h-[200px] bg-kelp",
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
                  "u-label-sm max-w-[14ch] leading-relaxed",
                  stat.featured ? "text-abyss/70" : "text-mist/80"
                )}
              >
                {stat.label}
              </p>
              <p
                className={cn(
                  "kinetic mt-10 text-[3.4rem] sm:text-[4.2rem]",
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
