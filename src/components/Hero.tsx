"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { heroStrip } from "@/data/clinicData";
import { ParticleSphere } from "./ParticleSphere";
import { useBooking } from "./BookingProvider";

export function Hero() {
  const { openBooking } = useBooking();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // the orb layer now spans the whole hero, so the same travel distance as the
  // old bottom-anchored box needs a much smaller percentage
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-[136px]"
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 82% 88%, rgba(0,150,142,0.32) 0%, rgba(1,38,36,0) 60%)," +
              "radial-gradient(90% 60% at 15% 10%, rgba(1,20,19,0.95) 0%, rgba(1,38,36,0) 65%)",
          }}
        />
        <div className="grain" />
      </div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="u-label text-mist/80"
        >
          Точка Зрения
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="display-tight mt-6 max-w-4xl text-balance text-[2.5rem] text-platinum sm:text-[3.4rem] lg:text-[3.9rem]"
        >
          Ясный взгляд на мир
          <br />
          для детей и взрослых
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-7 max-w-xl text-[15px] leading-[1.6] text-silver sm:text-base"
        >
          Высокоточная диагностика зрения, опытные офтальмологи и собственная оптика
          в медицинском центре «Точка Зрения».
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-9"
        >
          <button
            onClick={() => openBooking()}
            className="btn-aurora inline-flex items-center gap-2.5 px-7 py-4 font-medium"
          >
            Записаться онлайн
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </motion.div>
      </motion.div>

      {/* data orb */}
      <motion.div
        style={{ y: orbY, scale: orbScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="pointer-events-none absolute inset-0 -z-0"
      >
        <ParticleSphere className="h-full w-full" />
      </motion.div>

      {/* instrument strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 mt-auto w-full border-t border-white/10 bg-abyss/40 backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-[1440px] gap-6 px-6 py-6 sm:grid-cols-3 sm:gap-8 lg:px-10">
          {heroStrip.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <span className="u-label-sm text-aqua/80">{item.label}</span>
              <span className="text-[13px] leading-snug text-silver">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
