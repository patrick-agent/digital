import AnotherMeNavbar from '@/components/another-me/AnotherMeNavbar';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function DigitalLayout({ children }) {
  return (
    <>
      <AnotherMeNavbar />
      <SpeedInsights />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </>
  );
}
