"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { contact, methodMarquee, testimonials, trustBadges } from "@/data/clinicData";
import { AnimatedSection } from "./AnimatedSection";

export function TrustSection() {
  return (
    <section id="trust" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool left-[-4%] top-[30%] h-[360px] w-[420px] opacity-70" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="u-label text-mist/70">Доверие</p>
          <h2 className="display-tight mt-4 text-[2rem] text-platinum sm:text-[2.4rem]">
            Что говорят пациенты
          </h2>
        </AnimatedSection>

        <div className="mt-14 rounded-cards bg-deep">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-3 lg:gap-6">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.source}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:border-l lg:border-white/10 lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <p className="text-[15px] leading-[1.6] text-ash">«{item.quote}»</p>
                <div className="mt-auto pt-8">
                  <p className="u-label-sm text-mist">{item.author}</p>
                  <p className="u-label-sm mt-2 text-slate-deep">{item.source}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* rating + platforms */}
          <div className="grid gap-8 border-t border-white/10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <span className="kinetic text-[3rem] text-phosphor">
                  {contact.rating.value.toFixed(1)}
                </span>
                <div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-aqua text-aqua" />
                    ))}
                  </div>
                  <p className="u-label-sm mt-2 text-slate-deep">
                    {contact.rating.reviews} отзывов
                  </p>
                </div>
              </div>

              <div className="mt-8 flex max-w-sm flex-col gap-2.5">
                {contact.rating.breakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-4">
                    <span className="u-label-sm w-8 text-slate-deep">{row.stars}★</span>
                    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--gradient-biolum)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="u-label-sm w-9 text-right text-slate-deep">
                      {row.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <p className="u-label-sm text-slate-deep">Проверенные площадки</p>
              <div className="flex flex-wrap gap-3">
                {trustBadges.map((badge) => (
                  <a
                    key={badge.name}
                    href={badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 rounded-small border border-white/10 px-5 py-3.5 transition-colors duration-500 hover:border-aqua/40"
                  >
                    <span className="text-[14px] text-mist transition-colors group-hover:text-aqua">
                      {badge.name}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-slate-deep transition-colors group-hover:text-aqua"
                      strokeWidth={1.8}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* methods marquee — equipment and diagnostics from the price list */}
      <div className="marquee-mask relative mt-16 overflow-hidden border-y border-white/[0.07] py-7">
        <div className="animate-marquee flex w-max items-center gap-14">
          {[...methodMarquee, ...methodMarquee].map((method, i) => (
            <span
              key={`${method}-${i}`}
              className="u-label whitespace-nowrap text-silver/70"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
