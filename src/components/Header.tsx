"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { contact, navLinks } from "@/data/clinicData";
import { Logo } from "./Logo";
import { useBooking } from "./BookingProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "safe-top fixed top-0 left-0 right-0 z-50 transition-colors duration-500",
          scrolled || drawerOpen ? "bg-abyss/90 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 sm:h-[74px] sm:gap-4 sm:px-6 lg:px-10 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-6">
          <a href="#home" aria-label="Точка Зрения — на главную" className="min-w-0 shrink">
            <Logo compact />
          </a>

          <nav className="hidden min-w-0 items-center justify-center gap-x-3 overflow-hidden 2xl:gap-x-4 xl:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 text-[11px] font-medium uppercase leading-none tracking-[0.1em] text-silver transition-colors duration-300 hover:text-platinum 2xl:text-[12px] 2xl:tracking-[0.12em]"
              >
                {"shortLabel" in link && link.shortLabel ? link.shortLabel : link.label}
              </a>
            ))}
          </nav>

          <div className="relative z-10 flex h-full shrink-0 items-center justify-end gap-2 sm:gap-3">
            <a
              href={contact.phoneHref}
              aria-label={`Позвонить ${contact.phone}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-small text-aqua transition-colors hover:bg-white/5 lg:hidden"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={contact.phoneHref}
              className="hidden h-10 items-center gap-2 leading-none text-[13px] tracking-[0.04em] text-silver transition-colors hover:text-platinum lg:inline-flex"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-aqua" strokeWidth={1.75} />
              <span className="whitespace-nowrap">{contact.phone}</span>
            </a>
            <button
              onClick={() => openBooking()}
              className="btn-aurora hidden h-10 items-center gap-2 px-5 font-medium md:inline-flex"
            >
              Записаться
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Открыть меню"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-small text-platinum transition-colors hover:bg-white/5 xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div
          className={cn(
            "h-px w-full bg-white/10 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />
      </motion.header>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[120] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-abyss/80 backdrop-blur-md"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="safe-top absolute right-0 top-0 flex h-full w-full max-w-[22rem] flex-col bg-deep"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-5 sm:h-[74px] sm:px-6">
                <Logo compact />
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Закрыть меню"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-small text-silver hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.4 }}
                    className="flex min-h-12 items-center justify-between border-b border-white/5 py-3.5 text-[15px] text-mist transition-colors hover:text-aqua"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-deep" />
                  </motion.a>
                ))}
              </nav>

              <div className="safe-bottom mt-auto flex flex-col gap-4 border-t border-white/10 p-5 sm:p-6">
                <a
                  href={contact.phoneHref}
                  className="inline-flex h-11 items-center gap-2 leading-none text-platinum"
                >
                  <Phone className="h-4 w-4 text-aqua" /> {contact.phone}
                </a>
                <p className="u-label-sm text-slate-deep">
                  ПН–ПТ 8:00–20:00 · СБ 9:00–18:00
                </p>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    openBooking();
                  }}
                  className="btn-aurora w-full py-3.5 font-medium"
                >
                  Записаться онлайн
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
