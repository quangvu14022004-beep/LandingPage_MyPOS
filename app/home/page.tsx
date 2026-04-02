import Navbar from '@/components/landingpage/Navbar';
import HeroSection from '@/components/landingpage/HeroSection';
import FeaturesSection from '@/components/landingpage/FeaturesSection';
import MapWrapper from '@/components/landingpage/MapWrapper';
import StatsSection from '@/components/landingpage/StatsSection';
import CTASection from '@/components/landingpage/CTASection';
import Footer from '@/components/landingpage/Footer'; 

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <MapWrapper />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}