"use client";

import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { contact } from "@/data/clinicData";
import { AnimatedSection } from "./AnimatedSection";
import { useBooking } from "./BookingProvider";

export function ContactSection() {
  const { openBooking } = useBooking();

  return (
    <section id="contacts" className="relative overflow-hidden py-20 sm:py-28">
      <div className="glow-pool right-[10%] top-[0%] h-[380px] w-[520px] opacity-60" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="u-label text-mist/70">Контакты</p>
          <h2 className="display-tight mt-4 text-[2rem] text-platinum sm:text-[2.4rem]">
            Как нас найти
          </h2>
        </AnimatedSection>

        <div className="mt-14 grid gap-3 lg:grid-cols-5">
          <AnimatedSection delay={0.08} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-cards bg-kelp p-8 sm:p-10">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-aqua" strokeWidth={1.8} />
                    <p className="u-label-sm text-slate-deep">Адрес</p>
                  </div>
                  <p className="mt-3 text-[17px] leading-snug text-platinum">
                    {contact.address}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-aqua" strokeWidth={1.8} />
                    <p className="u-label-sm text-slate-deep">Телефон</p>
                  </div>
                  <a
                    href={contact.phoneHref}
                    className="mt-3 block text-[17px] text-platinum transition-colors hover:text-aqua"
                  >
                    {contact.phone}
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-aqua" strokeWidth={1.8} />
                    <p className="u-label-sm text-slate-deep">Режим работы</p>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {contact.hours.map((row) => (
                      <div
                        key={row.days}
                        className="flex items-baseline justify-between gap-6 border-b border-white/[0.07] pb-2 last:border-b-0"
                      >
                        <span className="text-[14px] text-silver">{row.days}</span>
                        <span className="text-[14px] text-mist">{row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => openBooking()}
                  className="btn-aurora inline-flex flex-1 items-center justify-center gap-2 px-6 py-3.5 font-medium"
                >
                  Записаться
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-small border border-white/15 px-6 py-3.5 text-[13px] uppercase tracking-[0.08em] text-mist transition-colors duration-500 hover:border-aqua/40 hover:text-aqua"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="lg:col-span-3">
            <div className="h-full min-h-[420px] overflow-hidden rounded-cards border border-white/[0.07]">
              <iframe
                src={contact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ minHeight: 420, border: 0, filter: "grayscale(0.35) contrast(1.05)" }}
                loading="lazy"
                title="Карта проезда к медицинскому центру «Точка Зрения»"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
