import AnotherMeNavbar from '@/components/another-me/AnotherMeNavbar';

export default function DigitalLayout({ children }) {
  return (
    <>
      <AnotherMeNavbar />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </>
  );
}
