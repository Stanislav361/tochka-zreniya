"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { contact } from "@/data/clinicData";
import { useBooking } from "./BookingProvider";

export function FloatingCTAs() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[100] flex flex-col items-end gap-2.5 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:right-[max(1.25rem,env(safe-area-inset-right))]">
      <AnimatePresence>
        {open && visible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-2.5"
          >
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 rounded-small bg-kelp/90 px-5 text-[12px] uppercase tracking-[0.08em] text-mist backdrop-blur-md transition-colors hover:bg-kelp"
            >
              <MessageCircle className="h-4 w-4 text-aqua" strokeWidth={1.8} />
              WhatsApp
            </a>
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 rounded-small bg-kelp/90 px-5 text-[12px] uppercase tracking-[0.08em] text-mist backdrop-blur-md transition-colors hover:bg-kelp"
            >
              <Send className="h-4 w-4 text-aqua" strokeWidth={1.8} />
              Telegram
            </a>
            <button
              onClick={() => openBooking()}
              className="btn-aurora inline-flex h-11 items-center gap-2.5 px-5 font-medium"
            >
              <CalendarPlus className="h-4 w-4" strokeWidth={1.8} />
              Записаться
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Быстрые действия"
            className="flex h-14 w-14 items-center justify-center rounded-small border border-aqua/25 bg-kelp/90 text-aqua backdrop-blur-md transition-colors hover:border-aqua/50 hover:text-mist"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "chat"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
