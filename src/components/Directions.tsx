"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { directions } from "@/data/clinicData";
import { MetaballGraphic } from "./MetaballGraphic";
import { useBooking } from "./BookingProvider";
import { AnimatedSection, staggerContainer, staggerItem } from "./AnimatedSection";

export function Directions() {
  const { openBooking } = useBooking();

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool left-[-10%] top-[30%] h-[420px] w-[560px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
          {/* left column — content card */}
          <AnimatedSection className="rounded-cards bg-kelp/45 p-8 sm:p-10">
            <p className="u-label text-mist/70">Направления</p>
            <h2 className="display-tight mt-4 text-[2rem] text-platinum sm:text-[2.4rem]">
              Что мы делаем
            </h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="mt-10 flex flex-col"
            >
              {directions.map((item, i) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  variants={staggerItem}
                  className="group border-t border-white/10 py-7 transition-colors duration-500 hover:bg-white/[0.03] first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] text-platinum sm:text-[26px]">
                      {item.title}
                    </h3>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-small bg-[rgba(3,81,75,0.5)] text-platinum transition-all duration-500 group-hover:bg-aqua group-hover:text-abyss">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                  <p className="mt-3 max-w-lg text-[15px] leading-[1.55] text-silver">
                    {item.description}
                  </p>
                  <span className="u-label-sm mt-3 inline-block text-slate-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </AnimatedSection>

          {/* right column — molecule graphic + CTA */}
          <div className="relative flex flex-col items-end justify-between gap-10 lg:pl-6">
            <AnimatedSection delay={0.1}>
              <button
                onClick={() => openBooking()}
                className="btn-biolum inline-flex items-center gap-2 px-5 py-3 font-medium"
              >
                Записаться онлайн
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </AnimatedSection>

            <AnimatedSection
              delay={0.15}
              className="flex w-full flex-1 items-center justify-center"
            >
              <div className="h-[300px] w-full max-w-[460px] sm:h-[400px]">
                <MetaballGraphic />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
