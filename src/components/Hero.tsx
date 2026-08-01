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

  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-[calc(6.75rem+env(safe-area-inset-top))] sm:pt-[136px]"
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 58%, rgba(0,170,158,0.42) 0%, rgba(1,38,36,0) 58%)," +
              "radial-gradient(90% 60% at 15% 10%, rgba(1,20,19,0.95) 0%, rgba(1,38,36,0) 65%)",
          }}
        />
        <div className="grain" />
      </div>

      {/* copy */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col items-center px-5 text-center sm:px-6"
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
          className="display-tight mt-3 max-w-[18ch] text-balance text-[1.85rem] leading-[1.08] text-platinum sm:mt-6 sm:max-w-4xl sm:text-[3.4rem] sm:leading-none lg:text-[3.9rem]"
        >
          Ясный взгляд на мир
          <br />
          для детей и взрослых
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-4 max-w-xl text-[14px] leading-[1.55] text-silver sm:mt-7 sm:text-base sm:leading-[1.6]"
        >
          Высокоточная диагностика зрения, опытные офтальмологи и собственная оптика
          в медицинском центре «Точка Зрения».
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-5 sm:mt-9"
        >
          <button
            onClick={() => openBooking()}
            className="btn-aurora inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2.5 px-6 py-3.5 font-medium sm:w-auto sm:max-w-none sm:px-7 sm:py-4"
          >
            Записаться онлайн
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </motion.div>
      </motion.div>

      {/*
        Mobile: planet sits in its own band ABOVE the three strip labels so
        nothing covers it. Desktop keeps the full-bleed dome behind the hero.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.35 }}
        className="relative z-[1] mt-5 h-[min(52vw,320px)] min-h-[260px] w-full shrink-0 sm:hidden"
      >
        <div className="absolute inset-0">
          <ParticleSphere
            className="h-full w-full"
            framing="full"
            halo="center"
            glyphSize={5}
            count={16000}
          />
        </div>
      </motion.div>

      <motion.div
        style={{ y: orbY, scale: orbScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="pointer-events-none absolute inset-0 z-0 hidden sm:block"
      >
        <ParticleSphere className="h-full w-full" glyphSize={5.5} />
      </motion.div>

      {/* strip — always below the planet on phones, never over it */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 mt-6 w-full shrink-0 border-t border-white/10 bg-deep sm:mt-auto sm:bg-abyss/55 sm:backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-[1440px] divide-y divide-white/10 px-5 py-5 sm:grid-cols-3 sm:gap-8 sm:divide-y-0 sm:px-6 sm:py-6 lg:px-10">
          {heroStrip.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:py-0"
            >
              <span className="u-label-sm text-aqua/80">{item.label}</span>
              <span className="text-[13px] leading-snug text-silver">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
