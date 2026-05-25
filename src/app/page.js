import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MusicSection from "@/components/sections/MusicSection";
import LatestEPSection from "@/components/sections/LatestEPSection";
import DonationSection from "@/components/sections/DonationSection";
import ContactSection from "@/components/sections/ContactSection";
import PreloadModels from "@/components/PreloadModels";
import ProgressTracker from "@/components/ProgressTracker";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingProvider } from "@/context/LoadingContext";

export default function Home() {
  return (
    <LoadingProvider>
      <LoadingScreen />
      <Navbar />
      <ErrorBoundary>
        <main>
          <PreloadModels />
          <ProgressTracker />
          <HeroSection />
          <AboutSection />
          <MusicSection />
          <LatestEPSection />
          <DonationSection />
          <ContactSection />
        </main>
      </ErrorBoundary>
      <Footer />
    </LoadingProvider>
  );
}
