"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/clinicData";
import { AnimatedSection, staggerContainer, staggerItem } from "./AnimatedSection";
import { useBooking } from "./BookingProvider";
import { formatPrice } from "@/lib/utils";

const opticsCatalogue = services.filter((s) => s.category === "Офтальмология: оптика");

export function OpticsModule() {
  const { openBooking } = useBooking();

  return (
    <section id="optics" className="relative overflow-hidden bg-deep py-20 sm:py-28">
      <div className="glow-pool left-[30%] top-[-10%] h-[420px] w-[620px] opacity-80" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <p className="u-label text-mist/70">Оптика</p>
            <h2 className="display-tight mt-4 text-[2rem] text-platinum sm:text-[2.4rem]">
              Очки и линзы
              <br />
              любой сложности
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.6] text-silver">
              Собственная оптика в клинике: индивидуальный подбор оправы, изготовление
              очков по рецепту врача, астигматические, бифокальные и прогрессивные линзы,
              подбор контактных линз с обучением.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-cards bg-kelp p-7">
                <p className="u-label-sm text-mist/80">Очки на заказ</p>
                <p className="kinetic mt-6 text-[2.6rem] text-phosphor">от 3 500 ₽</p>
              </div>
              <div className="rounded-cards bg-kelp/40 p-7">
                <p className="u-label-sm text-mist/80">Линзы с обучением</p>
                <p className="kinetic mt-6 text-[2.6rem] text-phosphor">1 500 ₽</p>
              </div>
            </div>

            <button
              onClick={() => openBooking({ serviceCode: "1.20.0" })}
              className="btn-aurora mt-8 inline-flex items-center gap-2 px-6 py-3.5 font-medium"
            >
              Подобрать очки
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="rounded-cards bg-white/[0.02] p-7 sm:p-9">
              <p className="u-label-sm text-slate-deep">Полный перечень оптики</p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={staggerContainer}
                className="mt-6 flex flex-col"
              >
                {opticsCatalogue.map((item) => (
                  <motion.button
                    key={item.code}
                    variants={staggerItem}
                    onClick={() => openBooking({ serviceCode: item.code })}
                    className="group flex items-center justify-between gap-6 border-t border-white/[0.06] py-4 text-left transition-colors duration-300 first:border-t-0 first:pt-0 hover:bg-white/[0.02]"
                  >
                    <span className="text-[14px] leading-snug text-silver transition-colors group-hover:text-mist">
                      {item.name}
                    </span>
                    <span className="whitespace-nowrap text-[15px] font-medium text-mist transition-colors group-hover:text-phosphor">
                      {formatPrice(item.price, item.priceFrom)}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
