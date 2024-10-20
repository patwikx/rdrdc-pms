
import ChatbotWidget from "@/components/chatbot-widget";
import LandingFooterPage from "@/components/footer/landing-footer/landing-footer";
import GoogleMapsSection from "@/components/google-maps";
import AboutUsPage from "@/components/landing-page/about-section";
import ContactUsPage from "@/components/landing-page/contact-us";
import FeaturedProperties from "@/components/landing-page/featured-properties";
import HeroPage from "@/components/landing-page/hero";
import MissionVisionPage from "@/components/landing-page/mission-vision";
import NotableClientPage from "@/components/landing-page/notable-clients";
import PropertyTypes from "@/components/landing-page/our-properties";
import OurServicesPage from "@/components/landing-page/our-services";
import PromotionalPage from "@/components/landing-page/promotional";

const properties = [
  { 
    id: "1",
    name: "RD Realty Development Corporation", 
    address: "45CM+3HH, General Santos City, South Cotabato", 
    contactNumber: "+63 123 456 7890",
    email: "info@rdrealty.com"
  },
  { 
    id: "2",
    name: "RD Plaza", 
    address: "Fiscal Gregorio Daproza Avenue Corner Pendatun Avenue, 9500 General Santos City, 9500", 
    contactNumber: "+63 234 567 8901",
    email: "info@rdplaza.com"
  },
  { 
    id: "3",
    name: "RD Hardware & Fishing Supply, Inc.", 
    address: "456H+RVX, Santiago Blvd, General Santos City, South Cotabato", 
    contactNumber: "+63 345 678 9012",
    email: "info@rdhardware.com"
  },
  { 
    id: "4",
    name: "FitMart Gensan", 
    address: "4579+3J4, Corner Claro M. Recto Street, Pres. Sergio Osmeña Avenue, Lungsod ng General Santos, 9500", 
    contactNumber: "+63 456 789 0123",
    email: "info@fitmartgensan.com"
  },
  { 
    id: "5",
    name: "Norfolk Pine Subdivision", 
    address: "44VJ+568, General Santos City Circumferential Rd, General Santos City, 9500 South Cotabato", 
    contactNumber: "+63 456 789 0123",
    email: "info@norfolkpine.com"
  },
  { 
    id: "6",
    name: "RD City Central Business District", 
    address: "545C+GFP RD City Central Business District, Polomolok, South Cotabato", 
    contactNumber: "+63 456 789 0123",
    email: "info@rdrealty.com.ph"
  },
  { 
    id: "7",
    name: "RD Realty Development Corporation - Cebu", 
    address: "8W92+9CP, Cebu City, 6000 Cebu", 
    contactNumber: "+63 456 789 0123",
    email: "info@rdrealty.com.ph"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroPage />
        <NotableClientPage />
        <PropertyTypes />
        <FeaturedProperties />
        <GoogleMapsSection properties={properties} />
        <OurServicesPage />
        <AboutUsPage />
        <MissionVisionPage />
        <ContactUsPage />
      </main>

      <LandingFooterPage />

      <ChatbotWidget />

      <PromotionalPage />
    </div>
  )
}
