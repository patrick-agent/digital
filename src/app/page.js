import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomeLazySections, { LazyFooter } from "@/components/HomeLazySections";

export default function Home() {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <main>
          <HeroSection />
          <HomeLazySections />
        </main>
      </ErrorBoundary>
      <LazyFooter />
    </>
  );
}
