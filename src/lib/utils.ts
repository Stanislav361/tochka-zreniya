import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number | null, priceFrom?: boolean): string {
  if (price === null) return "по запросу";
  const formatted = new Intl.NumberFormat("ru-RU").format(price);
  return `${priceFrom ? "от " : ""}${formatted} ₽`;
}
