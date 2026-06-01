import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomeLazySections, { LazyFooter } from "@/components/HomeLazySections";
import { readSettings } from "@/lib/db";

export const revalidate = 300;

export async function generateMetadata() {
  const settings = await readSettings();

  return {
    title: settings.seoTitle || settings.siteTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    openGraph: {
      title: settings.seoTitle || settings.siteTitle,
      description: settings.seoDescription,
      images: [{ url: settings.branding.logoUrl || "/apple-touch-icon.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle || settings.siteTitle,
      description: settings.seoDescription,
      images: [settings.branding.logoUrl || "/apple-touch-icon.png"],
    },
  };
}

export default async function Home() {
  const settings = await readSettings();

  return (
    <>
      <Navbar settings={settings} />
      <ErrorBoundary>
        <main>
          <HeroSection settings={settings} />
          <HomeLazySections settings={settings} />
        </main>
      </ErrorBoundary>
      <LazyFooter settings={settings} />
    </>
  );
}
