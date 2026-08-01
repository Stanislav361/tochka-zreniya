import { ArrowUpRight } from "lucide-react";
import { contact, navLinks } from "@/data/clinicData";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-deep">
      <div className="glow-pool left-[8%] top-[10%] h-[380px] w-[520px] opacity-70" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="display-tight max-w-md text-[2rem] text-platinum sm:text-[2.6rem]">
            Ясный взгляд
            <br />
            на мир
          </h2>

          <div className="flex flex-col items-start gap-5 lg:items-end">
            <p className="text-[20px] font-medium tracking-[-0.02em] text-platinum">
              Свяжитесь с нами
            </p>
            <a
              href={contact.phoneHref}
              className="btn-aurora inline-flex items-center gap-2 px-6 py-3.5 font-medium"
            >
              {contact.phone}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
            <p className="u-label-sm text-slate-deep lg:text-right">{contact.address}</p>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-10 border-t border-white/10 pt-10 lg:flex-row lg:items-start lg:justify-between">
          <Logo />

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="u-label-sm text-silver transition-colors duration-300 hover:text-aqua"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {[
              { name: "WhatsApp", url: contact.whatsapp },
              { name: "Telegram", url: contact.telegram },
            ].map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-small border border-white/15 px-4 py-2.5 text-[12px] uppercase tracking-[0.08em] text-silver transition-colors duration-500 hover:border-aqua/40 hover:text-aqua"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="u-label-sm text-slate-deep">
            © {new Date().getFullYear()} Медицинский центр «Точка Зрения»
          </p>
          <p className="u-label-sm text-slate-deep">
            Лицензия на медицинскую деятельность — по запросу
          </p>
        </div>
      </div>
    </footer>
  );
}
