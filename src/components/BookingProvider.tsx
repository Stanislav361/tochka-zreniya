"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type BookingPrefill = {
  doctorSlug?: string;
  serviceCode?: string;
};

type BookingContextValue = {
  isOpen: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});

  const openBooking = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, prefill, openBooking, closeBooking }),
    [isOpen, prefill, openBooking, closeBooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
