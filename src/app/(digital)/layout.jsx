import DigitalNavbar from '@/components/digital/DigitalNavbar';
import DigitalFooter from '@/components/digital/DigitalFooter';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function DigitalLayout({ children }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.lang='vi'",
        }}
      />
      <DigitalNavbar />
      <SpeedInsights />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <DigitalFooter />
    </>
  );
}
