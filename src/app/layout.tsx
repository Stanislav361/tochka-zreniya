import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Matter substitute per the style reference — geometric grotesk, weights 400/500 only.
const matter = Inter({
  variable: "--font-matter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#012624",
};

export const metadata: Metadata = {
  title: "Точка Зрения — Медицинский центр и Оптика",
  description:
    "Высокоточная диагностика зрения, опытные офтальмологи и собственная оптика в медицинском центре «Точка Зрения». Онлайн-запись, детский приём с 0 лет, аппаратное лечение.",
  keywords: [
    "офтальмолог",
    "оптика",
    "точка зрения",
    "проверка зрения",
    "детский офтальмолог",
    "очки",
    "контактные линзы",
    "аппаратное лечение зрения",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Точка Зрения",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${matter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-abyss text-silver antialiased">
        {children}
      </body>
    </html>
  );
}
