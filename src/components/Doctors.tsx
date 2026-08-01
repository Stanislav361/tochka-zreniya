"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { doctors, type Doctor } from "@/data/clinicData";
import { AnimatedSection, staggerContainer, staggerItem } from "./AnimatedSection";
import { useBooking } from "./BookingProvider";
import { cn } from "@/lib/utils";

/**
 * Monogram tile is the base layer and always renders; a portrait, when one is
 * configured, fades in over it once it decodes. Ordering it this way matters:
 * a missing file 404s while the HTML is still being parsed, before React
 * hydrates, so an onError fallback would never fire and the browser would
 * leave its broken-image icon on screen.
 */
function DoctorAvatar({ doctor, size = "md" }: { doctor: Doctor; size?: "md" | "lg" }) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const dims = size === "lg" ? "h-28 w-28 text-[28px]" : "h-16 w-16 text-[17px]";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-small ring-1 ring-inset ring-white/10",
        "bg-[linear-gradient(135deg,rgba(0,130,124,0.6)_0%,rgba(0,55,52,0.9)_55%,rgba(1,29,28,0.95)_100%)]",
        dims
      )}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 28% 22%, rgba(203,255,252,0.28) 0%, rgba(203,255,252,0) 62%)",
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center font-medium tracking-[0.06em] text-mist/90">
        {doctor.initials}
      </span>

      {doctor.photo && (
        /* eslint-disable-next-line @next/next/no-img-element -- optional local photo layered over the monogram */
        <img
          src={doctor.photo}
          alt={doctor.name}
          loading="lazy"
          decoding="async"
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth > 0) setHasPhoto(true);
          }}
          className={cn(
            "relative h-full w-full object-cover transition-opacity duration-700",
            hasPhoto ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}

export function Doctors() {
  const chief = doctors.find((d) => d.isChief)!;
  const rest = doctors.filter((d) => !d.isChief);
  const { openBooking } = useBooking();

  return (
    <section id="doctors" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool left-[45%] top-[8%] h-[360px] w-[520px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="u-label text-mist/70">Команда</p>
          <h2 className="display-tight mt-4 text-[2rem] text-platinum sm:text-[2.4rem]">
            Врачи центра
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-silver">
            Шесть специалистов: офтальмологи и детские офтальмологи, офтальмохирург,
            пульмонолог и эндокринолог.
          </p>
        </AnimatedSection>

        {/* chief physician */}
        <AnimatedSection delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-cards bg-kelp p-8 sm:p-10 lg:p-12">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(203,255,252,0.22) 0%, rgba(0,130,124,0) 70%)",
                filter: "blur(20px)",
              }}
            />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              <DoctorAvatar doctor={chief} size="lg" />

              <div className="flex-1">
                <p className="u-label-sm text-aqua">Главный врач</p>
                <h3 className="display-tight mt-3 text-[1.7rem] text-platinum sm:text-[2.1rem]">
                  {chief.name}
                </h3>
                <p className="mt-3 text-[15px] text-mist/80">{chief.specialty}</p>

                <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                  <div>
                    <p className="u-label-sm text-slate-deep">Стаж</p>
                    <p className="mt-1.5 text-[26px] font-medium tracking-[-0.02em] text-phosphor">
                      {chief.experienceLabel}
                    </p>
                  </div>
                  <div className="max-w-xs">
                    <p className="u-label-sm text-slate-deep">Награда</p>
                    <p className="mt-1.5 text-[15px] leading-snug text-mist">{chief.award}</p>
                  </div>
                </div>

                <p className="mt-6 max-w-2xl text-[15px] leading-[1.6] text-silver">
                  {chief.credentialsSummary}
                </p>

                <button
                  onClick={() => openBooking({ doctorSlug: chief.slug })}
                  className="btn-aurora mt-8 inline-flex items-center gap-2 px-6 py-3.5 font-medium"
                >
                  Записаться к главному врачу
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* other specialists */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {rest.map((doctor) => (
            <motion.div
              key={doctor.slug}
              variants={staggerItem}
              className="group flex flex-col rounded-cards bg-kelp/40 p-7 transition-colors duration-500 hover:bg-kelp/70"
            >
              <div className="flex items-start gap-4">
                <DoctorAvatar doctor={doctor} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-platinum">
                    {doctor.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-aqua/80">
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-[22px] font-medium tracking-[-0.02em] text-phosphor">
                  {doctor.experienceLabel}
                </span>
                <span className="u-label-sm text-slate-deep">стажа</span>
              </div>

              <p className="mt-4 flex-1 text-[14px] leading-[1.55] text-silver">
                {doctor.credentialsSummary}
              </p>

              <button
                onClick={() => openBooking({ doctorSlug: doctor.slug })}
                className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-left"
              >
                <span className="u-label-sm text-mist transition-colors group-hover:text-aqua">
                  Записаться
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-small bg-[rgba(3,81,75,0.5)] text-platinum transition-all duration-500 group-hover:bg-aqua group-hover:text-abyss">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
