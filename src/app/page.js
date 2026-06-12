import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomeLazySections, { LazyFooter } from "@/components/HomeLazySections";
import { readSettings } from "@/lib/db";
import { absoluteUrl, defaultRobots, siteMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata() {
  const settings = await readSettings();
  const title = settings.seoTitle || settings.siteTitle || siteMetadata.title;
  const description = settings.seoDescription || siteMetadata.description;
  const image = absoluteUrl(settings.branding?.logoUrl || "/apple-touch-icon.png");

  return {
    title,
    description,
    keywords: settings.seoKeywords,
    openGraph: {
      title,
      description,
      url: siteMetadata.siteUrl,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: siteMetadata.siteUrl,
    },
    robots: {
      ...defaultRobots,
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
