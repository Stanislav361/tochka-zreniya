"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Check, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { doctors, services } from "@/data/clinicData";
import { useBooking, type BookingPrefill } from "./BookingProvider";
import { formatPrice } from "@/lib/utils";

export function BookingModal() {
  const { isOpen, prefill, closeBooking } = useBooking();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeBooking]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-abyss/80 backdrop-blur-md"
            onClick={closeBooking}
          />

          <motion.div
            className="safe-bottom relative flex max-h-[min(92vh,100dvh)] w-full flex-col overflow-hidden rounded-t-cards bg-deep sm:max-w-lg sm:rounded-cards"
            initial={{ y: 48, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.99 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,190,178,0.28) 0%, rgba(1,29,28,0) 70%)",
                filter: "blur(24px)",
              }}
            />

            <div className="relative flex items-start justify-between border-b border-white/10 px-5 pb-5 pt-6 sm:px-9 sm:pt-7">
              <div className="min-w-0 pr-3">
                <p className="u-label-sm text-aqua">Онлайн-запись</p>
                <h3 className="display-tight mt-2 text-[1.35rem] leading-tight text-platinum sm:text-[1.5rem] sm:leading-none">
                  Записаться на приём
                </h3>
              </div>
              <button
                onClick={closeBooking}
                aria-label="Закрыть"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-small text-slate-deep transition-colors hover:bg-white/5 hover:text-mist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative overflow-y-auto overscroll-contain px-5 py-6 sm:px-9 sm:py-7">
              <BookingForm
                key={`${prefill.doctorSlug ?? ""}::${prefill.serviceCode ?? ""}`}
                prefill={prefill}
                onClose={closeBooking}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BookingForm({
  prefill,
  onClose,
}: {
  prefill: BookingPrefill;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorSlug, setDoctorSlug] = useState(prefill.doctorSlug ?? "");
  const [serviceCode, setServiceCode] = useState(prefill.serviceCode ?? "");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const selectedService = useMemo(
    () => services.find((s) => s.code === serviceCode),
    [serviceCode]
  );

  // Native date/time inputs expect local "YYYY-MM-DD" / "HH:mm" values.
  const minDay = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }, []);

  function openNativePicker(input: HTMLInputElement) {
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        // Some browsers only allow showPicker after a trusted gesture
        // with stricter conditions — falling back to the native control.
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const date = day && time ? `${day}T${time}` : day || time;
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, doctorSlug, serviceCode, date }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        className="flex flex-col items-center py-10 text-center"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(3,81,75,0.6)]">
          <Check className="h-6 w-6 text-aqua" strokeWidth={2} />
        </div>
        <h4 className="display-tight mt-6 text-[1.4rem] text-platinum">Заявка отправлена</h4>
        <p className="mt-3 max-w-sm text-[14px] leading-[1.6] text-silver">
          Администратор свяжется с вами в ближайшее время, чтобы подтвердить дату и время
          приёма.
        </p>
        <button
          onClick={onClose}
          className="btn-aurora mt-8 px-7 py-3.5 font-medium"
        >
          Понятно
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-small border border-red-500/25 bg-red-500/10 px-4 py-3.5"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" strokeWidth={1.8} />
          <p className="text-[13px] leading-[1.5] text-silver">
            Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.
          </p>
        </motion.div>
      )}

      <Field label="Врач — по желанию">
        <select
          value={doctorSlug}
          onChange={(e) => setDoctorSlug(e.target.value)}
          className={controlClasses}
        >
          <option value="">Любой свободный специалист</option>
          {doctors.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name} —{" "}
              {d.isChief ? "главный врач" : d.specialty.split(",")[0].toLowerCase()}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Услуга или комплекс">
        <select
          value={serviceCode}
          onChange={(e) => setServiceCode(e.target.value)}
          className={controlClasses}
          required
        >
          <option value="">Выберите услугу</option>
          {services.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} · {s.name}
            </option>
          ))}
        </select>
      </Field>

      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-small border border-aqua/20 bg-[rgba(3,81,75,0.35)] px-5 py-4"
        >
          <span className="u-label-sm text-mist/70">Стоимость</span>
          <span className="text-[19px] font-medium tracking-[-0.02em] text-phosphor">
            {formatPrice(selectedService.price, selectedService.priceFrom)}
          </span>
        </motion.div>
      )}

      <Field label="Ваше имя">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Иван Иванов"
          className={controlClasses}
          required
        />
      </Field>

      <Field label="Телефон">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="+7 (___) ___-__-__"
          className={controlClasses}
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Желаемая дата">
          <input
            type="date"
            value={day}
            min={minDay}
            onChange={(e) => setDay(e.target.value)}
            onClick={(e) => openNativePicker(e.currentTarget)}
            className={pickerClasses}
          />
        </Field>

        <Field label="Желаемое время">
          <input
            type="time"
            value={time}
            step={300}
            onChange={(e) => setTime(e.target.value)}
            onClick={(e) => openNativePicker(e.currentTarget)}
            className={pickerClasses}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-aurora mt-2 inline-flex items-center justify-center gap-2 py-4 font-medium disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Отправка
          </>
        ) : (
          <>
            Отправить заявку
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </>
        )}
      </button>

      <p className="u-label-sm text-center leading-relaxed text-slate-deep">
        Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="u-label-sm text-slate-deep">{label}</span>
      {children}
    </label>
  );
}

const controlClasses =
  "w-full rounded-small border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[16px] text-mist outline-none transition-colors placeholder:text-slate-deep focus:border-aqua/40 focus:bg-white/[0.06] sm:text-[14px] [&>option]:bg-deep [&>option]:text-mist";

const pickerClasses =
  `${controlClasses} [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80 [&::-webkit-calendar-picker-indicator]:invert`;
