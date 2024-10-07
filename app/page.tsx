
import ChatbotWidget from "@/components/chatbot-widget";
import LandingFooterPage from "@/components/footer/landing-footer/landing-footer";
import GoogleMapsSection from "@/components/google-maps";
import AboutUsPage from "@/components/landing-page/about-section";
import ContactUsPage from "@/components/landing-page/contact-us";
import FeaturedProperties from "@/components/landing-page/featured-properties";
import HeroPage from "@/components/landing-page/hero";
import NotableClientPage from "@/components/landing-page/notable-clients";
import PropertyTypes from "@/components/landing-page/our-properties";
import OurServicesPage from "@/components/landing-page/our-services";
import PromotionalPage from "@/components/landing-page/promotional";

const locations = [
  { name: "RD Realty Development Corporation", address: "45CM+3HH, General Santos City, South Cotabato", marked: true },
  { name: "RD Plaza", address: "Fiscal Gregorio Daproza Avenue Corner Pendatun Avenue, 9500 General Santos City, 9500", marked: true },
  { name: "RD Hardware & Fishing Supply, Inc.", address: "456H+RVX, Santiago Blvd, General Santos City, South Cotabato", marked: true},
  { name: "FitMart Gensan", address: "4579+3J4, Corner Claro M. Recto Street, Pres. Sergio Osmeña Avenue, Lungsod ng General Santos, 9500", marked: true },

  // Add more locations as needed
];

  export default function Home() {
    return (
<div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroPage />
        <NotableClientPage />
        <PropertyTypes />
        <FeaturedProperties />
        <GoogleMapsSection locations={locations} />
        <OurServicesPage />
        <AboutUsPage />
        <ContactUsPage />
      </main>

      <LandingFooterPage />

      <ChatbotWidget />

      <PromotionalPage />
    </div>
    )
  }
