'use client';
import { useLang } from '@/lib/LanguageContext';
import Navbar from '@/components/landingpage/Navbar';
import HeroSection from '@/components/landingpage/HeroSection';
import FeaturesSection from '@/components/landingpage/FeaturesSection';
import AppScreensSection from '@/components/landingpage/AppScreensSection';
import MapWrapper from '@/components/landingpage/MapWrapper';
import StatsSection from '@/components/landingpage/StatsSection';
import CTASection from '@/components/landingpage/CTASection';
import Footer from '@/components/landingpage/Footer'; 

export default function HomePage() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AppScreensSection isDark={isDark} />
      <MapWrapper />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}