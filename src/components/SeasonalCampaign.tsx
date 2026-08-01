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
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
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

            <div className="relative grid gap-8 p-6 sm:gap-10 sm:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:p-16">
              <div>
                <p className="u-label text-aqua">Акция: школа и детский сад</p>
                <h2 className="display-tight mt-4 max-w-xl text-balance text-[1.65rem] leading-[1.1] text-platinum sm:mt-5 sm:text-[2.4rem] sm:leading-none">
                  {seasonalCampaign.title}
                </h2>
                <p className="mt-5 max-w-lg text-[14px] leading-[1.55] text-silver sm:mt-6 sm:text-[15px] sm:leading-[1.6]">
                  {seasonalCampaign.description}
                </p>

                <div className="mt-8 flex flex-col items-start gap-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-end sm:gap-10">
                  <div>
                    <p className="u-label-sm text-slate-deep">
                      {seasonalCampaign.packageName}
                    </p>
                    <p className="kinetic mt-2 text-[2.6rem] text-phosphor sm:mt-3 sm:text-[3.2rem]">
                      {formatPrice(seasonalCampaign.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => openBooking({ serviceCode: seasonalCampaign.packageCode })}
                    className="btn-aurora inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3.5 font-medium sm:w-auto sm:py-4"
                  >
                    {seasonalCampaign.cta}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex flex-col justify-center">
                <p className="u-label-sm text-slate-deep">Детские программы</p>
                <div className="mt-4 flex flex-col sm:mt-5">
                  {schoolPrograms.map((program) => (
                    <button
                      key={program.code}
                      onClick={() => openBooking({ serviceCode: program.code })}
                      className="group flex flex-col gap-2 border-t border-white/10 py-4 text-left first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
                    >
                      <span className="flex min-w-0 items-start gap-3 sm:items-center">
                        <span className="u-label-sm shrink-0 text-slate-deep">{program.code}</span>
                        <span className="text-[14px] leading-snug text-silver transition-colors group-hover:text-mist">
                          {program.name}
                        </span>
                      </span>
                      <span className="whitespace-nowrap pl-10 text-[15px] font-medium text-mist transition-colors group-hover:text-phosphor sm:pl-0">
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
