import { BookingModal } from "@/components/BookingModal";
import { BookingProvider } from "@/components/BookingProvider";
import { ContactSection } from "@/components/ContactSection";
import { Directions } from "@/components/Directions";
import { Doctors } from "@/components/Doctors";
import { FloatingCTAs } from "@/components/FloatingCTAs";
import { Footer } from "@/components/Footer";
import { HardwareModule } from "@/components/HardwareModule";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KineticText } from "@/components/KineticText";
import { OpticsModule } from "@/components/OpticsModule";
import { PriceCatalog } from "@/components/PriceCatalog";
import { SeasonalCampaign } from "@/components/SeasonalCampaign";
import { StatementSection } from "@/components/StatementSection";
import { StatsBento } from "@/components/StatsBento";
import { TrustSection } from "@/components/TrustSection";

export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <main className="flex-1">
        <Hero />

        <KineticText lineOne="Ясный взгляд" lineTwo="на мир" />

        <StatementSection glowSide="right">
          «Точка Зрения» — медицинский центр и оптика полного цикла для детей и взрослых.
        </StatementSection>

        <Directions />
        <StatsBento />
        <SeasonalCampaign />
        <Doctors />

        <StatementSection glowSide="left">
          Мы формируем культуру заботы о зрении с первых лет жизни.
        </StatementSection>

        <PriceCatalog />
        <HardwareModule />
        <OpticsModule />
        <TrustSection />

        <StatementSection>
          Точная диагностика начинается с внимания к каждому пациенту.
        </StatementSection>

        <ContactSection />
      </main>
      <Footer />
      <FloatingCTAs />
      <BookingModal />
    </BookingProvider>
  );
}
