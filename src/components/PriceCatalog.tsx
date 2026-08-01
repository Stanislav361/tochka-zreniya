"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  featuredPackages,
  getServiceTab,
  priceTabs,
  services,
  type PriceTab,
  type Service,
} from "@/data/clinicData";
import { AnimatedSection } from "./AnimatedSection";
import { useBooking } from "./BookingProvider";
import { cn, formatPrice } from "@/lib/utils";

const categories = priceTabs.filter((tab): tab is Exclude<PriceTab, "Все категории"> => {
  return tab !== "Все категории";
});

function matchesQuery(service: Service, q: string) {
  if (!q) return true;
  return (
    service.name.toLowerCase().includes(q) ||
    service.code.toLowerCase().includes(q) ||
    service.description.toLowerCase().includes(q)
  );
}

function categoriesMatching(q: string) {
  return categories.filter((tab) =>
    services.some(
      (service) => getServiceTab(service) === tab && matchesQuery(service, q)
    )
  );
}

function ServiceRow({ service }: { service: Service }) {
  const { openBooking } = useBooking();

  return (
    <div className="group flex flex-col gap-4 border-t border-white/[0.06] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5 sm:px-6 sm:py-5">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="u-label-sm text-slate-deep">{service.code}</span>
          <span className="h-px w-6 bg-white/10" />
        </div>
        <h4 className="mt-2 text-[14px] font-medium leading-snug text-platinum sm:text-[15px]">
          {service.name}
        </h4>
        <p className="mt-2 text-[13px] leading-[1.55] text-silver/80">
          {service.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span className="whitespace-nowrap text-[17px] font-medium tracking-[-0.02em] text-phosphor sm:text-[18px]">
          {formatPrice(service.price, service.priceFrom)}
        </span>
        <button
          onClick={() => openBooking({ serviceCode: service.code })}
          aria-label={`Записаться: ${service.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-small bg-[rgba(3,81,75,0.5)] text-platinum transition-all duration-500 hover:bg-aqua hover:text-abyss sm:h-8 sm:w-8"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

export function PriceCatalog() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<PriceTab>>(() => new Set());
  const { openBooking } = useBooking();

  const q = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    return categories.map((tab) => {
      const items = services.filter(
        (service) => getServiceTab(service) === tab && matchesQuery(service, q)
      );
      return { tab, items };
    });
  }, [q]);

  const visibleGroups = grouped.filter((group) => group.items.length > 0);
  const totalFound = visibleGroups.reduce((sum, group) => sum + group.items.length, 0);
  const allOpen =
    visibleGroups.length > 0 && visibleGroups.every((group) => open.has(group.tab));

  const setQueryAndReveal = (value: string) => {
    setQuery(value);
    const next = value.trim().toLowerCase();
    if (!next) return;
    // surface search hits immediately without waiting for a click
    setOpen(new Set(categoriesMatching(next)));
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpen(new Set());
      return;
    }
    setOpen(new Set(visibleGroups.map((group) => group.tab)));
  };

  const toggleCategory = (tab: PriceTab) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(tab)) next.delete(tab);
      else next.add(tab);
      return next;
    });
  };

  return (
    <section id="prices" className="relative overflow-hidden bg-deep py-16 sm:py-28">
      <div className="glow-pool left-[-8%] top-[55%] h-[380px] w-[480px] opacity-70" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="u-label text-mist/70">Прайс-лист</p>
          <h2 className="display-tight mt-4 text-[1.75rem] text-platinum sm:text-[2.4rem]">
            Услуги и цены
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-silver">
            79 услуг и диагностических комплексов — от первичного приёма до годовых
            программ наблюдения.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="mt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg) => (
              <button
                key={pkg.code}
                onClick={() => openBooking({ serviceCode: pkg.code })}
                className="group flex flex-col rounded-cards bg-kelp/50 p-5 text-left transition-colors duration-500 hover:bg-kelp sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-platinum">
                      {pkg.name}
                    </h3>
                    <p className="u-label-sm mt-2 text-slate-deep">{pkg.subtitle}</p>
                  </div>
                  <span className="u-label-sm shrink-0 rounded-small bg-[rgba(3,81,75,0.5)] px-2 py-1 text-aqua">
                    {pkg.code}
                  </span>
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <span className="text-[30px] font-medium leading-none tracking-[-0.03em] text-phosphor">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-small bg-[rgba(3,81,75,0.5)] text-platinum transition-all duration-500 group-hover:bg-aqua group-hover:text-abyss">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.12} className="mt-16">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-deep" />
            <input
              value={query}
              onChange={(e) => setQueryAndReveal(e.target.value)}
              placeholder="Поиск по названию или коду услуги"
              className="w-full rounded-small border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-11 text-[16px] text-mist outline-none transition-colors placeholder:text-slate-deep focus:border-aqua/40 focus:bg-white/[0.06] sm:text-[14px]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Очистить поиск"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-deep transition-colors hover:text-mist"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </AnimatedSection>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="u-label-sm text-slate-deep">
            Найдено услуг: <span className="text-mist">{totalFound}</span>
          </p>
          <button
            type="button"
            onClick={toggleAll}
            disabled={visibleGroups.length === 0}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-small border px-4 text-[12px] tracking-[0.06em] uppercase transition-colors duration-300",
              allOpen
                ? "border-aqua/40 bg-aqua/10 text-aqua"
                : "border-white/10 text-silver hover:border-aqua/30 hover:text-mist",
              visibleGroups.length === 0 && "opacity-40"
            )}
          >
            {allOpen ? "Свернуть все" : "Все категории"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                allOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {visibleGroups.map(({ tab, items }) => {
            const isOpen = open.has(tab);
            const panelId = `price-panel-${tab}`;
            const headerId = `price-header-${tab}`;

            return (
              <div
                key={tab}
                className="overflow-hidden rounded-cards border border-white/[0.06] bg-white/[0.02]"
              >
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleCategory(tab)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors duration-300 hover:bg-white/[0.03] sm:gap-4 sm:px-6 sm:py-5"
                >
                  <div className="min-w-0">
                    <span className="block text-[15px] font-medium leading-snug text-platinum sm:text-[16px]">
                      {tab}
                    </span>
                    <span className="u-label-sm mt-1.5 block text-slate-deep">
                      {items.length}{" "}
                      {items.length === 1
                        ? "услуга"
                        : items.length < 5
                          ? "услуги"
                          : "услуг"}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-small border border-white/10 text-mist transition-all duration-300",
                      isOpen && "border-aqua/35 bg-aqua/10 text-aqua"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-1">
                        {items.map((service) => (
                          <ServiceRow key={service.code} service={service} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {visibleGroups.length === 0 && (
          <p className="py-20 text-center text-[15px] text-slate-deep">
            Ничего не найдено. Измените запрос или выберите другую категорию.
          </p>
        )}
      </div>
    </section>
  );
}
