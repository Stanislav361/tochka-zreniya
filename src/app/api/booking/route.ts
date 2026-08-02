import { NextResponse } from "next/server";
import { doctors, services } from "@/data/clinicData";

type BookingPayload = {
  name?: unknown;
  phone?: unknown;
  doctorSlug?: unknown;
  serviceCode?: unknown;
  date?: unknown;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Formats a preferred slot ("YYYY-MM-DDTHH:mm", date-only, or time-only) for Telegram. */
function formatPreferredSlot(value: string): string {
  const dateTime = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (dateTime) {
    const [, year, month, day, hour, minute] = dateTime;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return value;
}

export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = asTrimmedString(body.name);
  const phone = asTrimmedString(body.phone);
  const date = asTrimmedString(body.date);

  if (!name || !phone) {
    return NextResponse.json({ error: "Укажите имя и телефон" }, { status: 400 });
  }

  const doctor = doctors.find((d) => d.slug === asTrimmedString(body.doctorSlug));
  const service = services.find((s) => s.code === asTrimmedString(body.serviceCode));

  const lines = [
    "👁 <b>Новая заявка на приём — сайт «Точка Зрения»</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Врач:</b> ${doctor ? escapeHtml(doctor.name) : "Любой свободный специалист"}`,
    `<b>Услуга:</b> ${service ? escapeHtml(`${service.code} · ${service.name}`) : "Не выбрана"}`,
    `<b>Желаемая дата/время:</b> ${date ? escapeHtml(formatPreferredSlot(date)) : "Не указано"}`,
  ];

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID is not configured");
    return NextResponse.json(
      { error: "Уведомления о записи временно не настроены" },
      { status: 500 }
    );
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "HTML",
    }),
  });

  if (!telegramResponse.ok) {
    console.error("Telegram sendMessage failed:", await telegramResponse.text());
    return NextResponse.json(
      { error: "Не удалось отправить уведомление, попробуйте ещё раз" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
