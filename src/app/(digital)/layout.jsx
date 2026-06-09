import AnotherMeNavbar from '@/components/another-me/AnotherMeNavbar';
import AnotherMeFooter from '@/components/another-me/AnotherMeFooter';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function DigitalLayout({ children }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.lang='vi'",
        }}
      />
      <AnotherMeNavbar />
      <SpeedInsights />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <AnotherMeFooter />
    </>
  );
}
