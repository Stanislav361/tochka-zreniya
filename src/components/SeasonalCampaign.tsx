"use client";

import { ArrowUpRight } from "lucide-react";
import { seasonalCampaign, services } from "@/data/clinicData";
import { AnimatedSection } from "./AnimatedSection";
import { ParticleSphere } from "./ParticleSphere";
import { useBooking } from "./BookingProvider";
import { formatPrice } from "@/lib/utils";

const schoolPrograms = ["К-2", "К-7", "К-6", "Д-1"]
  .map((code) => services.find((s) => s.code === code))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

export function SeasonalCampaign() {
  const { openBooking } = useBooking();

  return (
    <section id="campaign" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-cards bg-deep">
            {/* aurora light bloom on the right, echoing the coverage card */}
            <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 lg:block">
              <ParticleSphere
                className="h-full w-full"
                framing="full"
                halo="center"
                count={11000}
                glyphSize={4.2}
              />
            </div>

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:p-16">
              <div>
                <p className="u-label text-aqua">Акция: школа и детский сад</p>
                <h2 className="display-tight mt-5 max-w-xl text-balance text-[1.9rem] text-platinum sm:text-[2.4rem]">
                  {seasonalCampaign.title}
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-[1.6] text-silver">
                  {seasonalCampaign.description}
                </p>

                <div className="mt-10 flex flex-wrap items-end gap-10">
                  <div>
                    <p className="u-label-sm text-slate-deep">
                      {seasonalCampaign.packageName}
                    </p>
                    <p className="kinetic mt-3 text-[3.2rem] text-phosphor">
                      {formatPrice(seasonalCampaign.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => openBooking({ serviceCode: seasonalCampaign.packageCode })}
                    className="btn-aurora inline-flex items-center gap-2 px-6 py-4 font-medium"
                  >
                    {seasonalCampaign.cta}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex flex-col justify-center">
                <p className="u-label-sm text-slate-deep">Детские программы</p>
                <div className="mt-5 flex flex-col">
                  {schoolPrograms.map((program) => (
                    <button
                      key={program.code}
                      onClick={() => openBooking({ serviceCode: program.code })}
                      className="group flex items-center justify-between gap-5 border-t border-white/10 py-4 text-left first:border-t-0 first:pt-0"
                    >
                      <span className="flex items-center gap-3">
                        <span className="u-label-sm text-slate-deep">{program.code}</span>
                        <span className="text-[14px] leading-snug text-silver transition-colors group-hover:text-mist">
                          {program.name}
                        </span>
                      </span>
                      <span className="whitespace-nowrap text-[15px] font-medium text-mist transition-colors group-hover:text-phosphor">
                        {formatPrice(program.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
