"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { hardwarePrograms, services } from "@/data/clinicData";
import { AnimatedSection, staggerContainer, staggerItem } from "./AnimatedSection";
import { useBooking } from "./BookingProvider";
import { formatPrice } from "@/lib/utils";

const singleSessions = services.filter(
  (s) => s.category === "Офтальмология: аппаратное лечение" && s.name.includes("(1 сеанс)")
);

export function HardwareModule() {
  const { openBooking } = useBooking();

  return (
    <section id="hardware" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool right-[-6%] top-[20%] h-[420px] w-[520px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <AnimatedSection>
            <p className="u-label text-mist/70">Аппаратное лечение</p>
            <h2 className="display-tight mt-4 text-[1.75rem] text-platinum sm:text-[2.4rem]">
              Восстановление зрения
              <br />
              без операции
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.6] text-silver">
              Курсы аппаратной терапии для детей и взрослых: тренировка амблиопии и
              косоглазия, снятие зрительного утомления, укрепление аккомодации — без боли
              и уколов, в игровой форме.
            </p>

            <div className="mt-10 rounded-cards bg-kelp/50 p-7">
              <p className="u-label-sm text-aqua">Выгода курса</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-mist">
                Курс из 10 сеансов дешевле десяти разовых процедур — например, «Спекл-М»
                7 000 ₽ вместо 8 000 ₽, «Ручеек» 6 000 ₽ вместо 7 000 ₽.
              </p>
            </div>

            <button
              onClick={() => openBooking({ serviceCode: "1.51" })}
              className="btn-aurora mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3.5 font-medium sm:w-auto"
            >
              Записаться на курс
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </AnimatedSection>

          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="flex flex-col gap-3"
            >
              {hardwarePrograms.map((program) => (
                <motion.div
                  key={program.key}
                  variants={staggerItem}
                  className="group rounded-cards bg-kelp/40 p-5 transition-colors duration-500 hover:bg-kelp sm:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-medium tracking-[-0.02em] text-platinum sm:text-[20px]">
                        {program.name}
                      </h3>
                      <p className="mt-2.5 max-w-md text-[14px] leading-[1.55] text-silver">
                        {program.description}
                      </p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className="text-[24px] font-medium leading-none tracking-[-0.03em] text-phosphor sm:text-[26px]">
                        {formatPrice(program.price)}
                      </p>
                      <p className="u-label-sm mt-2 text-slate-deep">
                        {program.sessions} сеансов
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="u-label-sm text-slate-deep">
                      1 сеанс — {formatPrice(program.unitPrice)}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-small bg-[rgba(3,81,75,0.5)] text-platinum transition-all duration-500 group-hover:bg-aqua group-hover:text-abyss">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* single-session ledger straight from the price list */}
            <AnimatedSection delay={0.1} className="mt-3 rounded-cards bg-white/[0.02] p-5 sm:p-7">
              <p className="u-label-sm text-slate-deep">Разовые сеансы</p>
              <div className="mt-5 flex flex-col">
                {singleSessions.map((s) => (
                  <div
                    key={s.code}
                    className="flex items-start justify-between gap-3 border-t border-white/[0.06] py-3 first:border-t-0 first:pt-0 sm:items-center sm:gap-4"
                  >
                    <span className="min-w-0 text-[14px] leading-snug text-silver">
                      {s.name.replace(" (1 сеанс)", "")}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-[15px] font-medium text-mist">
                      {formatPrice(s.price)}
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
