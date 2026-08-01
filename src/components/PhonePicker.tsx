"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { contact } from "@/data/clinicData";
import { cn } from "@/lib/utils";

type Variant = "icon" | "inline";

export function PhonePicker({
  variant = "icon",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Выбрать номер для звонка"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          variant === "icon" &&
            "inline-flex h-10 w-10 items-center justify-center rounded-small text-aqua transition-colors hover:bg-white/5",
          variant === "inline" &&
            "inline-flex h-10 items-center gap-2 leading-none text-[13px] tracking-[0.04em] text-silver transition-colors hover:text-platinum"
        )}
      >
        <Phone
          className={cn(variant === "icon" ? "h-4 w-4" : "h-3.5 w-3.5 shrink-0 text-aqua")}
          strokeWidth={1.75}
        />
        {variant === "inline" && (
          <span className="whitespace-nowrap">Позвонить</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Номера телефонов"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(100vw-2.5rem,17rem)] overflow-hidden rounded-cards border border-white/10 bg-deep/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            {contact.phones.map((phone) => (
              <a
                key={phone.href}
                role="menuitem"
                href={phone.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 rounded-small px-3.5 py-3 transition-colors hover:bg-white/[0.06]"
              >
                <span className="u-label-sm text-slate-deep">{phone.label}</span>
                <span className="text-[15px] font-medium tracking-[-0.01em] text-platinum">
                  {phone.display}
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PhoneLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {contact.phones.map((phone) => (
        <a
          key={phone.href}
          href={phone.href}
          className="inline-flex items-center gap-2 text-[17px] text-platinum transition-colors hover:text-aqua"
        >
          <Phone className="h-4 w-4 shrink-0 text-aqua" strokeWidth={1.8} />
          <span>{phone.display}</span>
        </a>
      ))}
    </div>
  );
}
