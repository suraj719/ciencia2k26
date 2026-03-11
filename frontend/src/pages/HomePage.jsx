import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import EventsSection from "../components/EventsSection";
import FlagshipSpotlight from "../components/FlagshipSpotlight";
import GallerySection from "../components/GallerySection";
import SponsorsSection from "../components/SponsorsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <Hero />
      <EventsSection />
      <FlagshipSpotlight />
      <GallerySection />
      <SponsorsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;
