import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "@/app/legal.module.css";

export const metadata = {
  title: "Privacy Policy — Tachy Artist",
  description:
    "Privacy policy for the Tachy Artist website. Learn how we collect, use, and protect your personal data.",
  openGraph: {
    title: "Privacy Policy — Tachy Artist",
    description:
      "Privacy policy for the Tachy Artist website.",
    type: "website",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Tachy Artist",
    description: "Privacy policy for the Tachy Artist website.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: "https://tachy.io.vn/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: May 25, 2026</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
          <p>
            We collect minimal information necessary to operate and improve this website. This may include:
          </p>
          <ul>
            <li>Contact form submissions (name, email, message content)</li>
            <li>Anonymous usage data via third-party analytics services</li>
            <li>Newsletter subscription email addresses (if applicable)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p>Your information is used only for the following purposes:</p>
          <ul>
            <li>To respond to inquiries submitted via the contact form</li>
            <li>To send newsletters or updates (only if you have opted in)</li>
            <li>To analyze website traffic and improve user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p>We will never sell, rent, or share your personal data with third parties for their marketing purposes.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Cookies</h2>
          <p>
            This website may use cookies and similar technologies to enhance your browsing experience. Cookies are small text files stored on your device. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the website.
          </p>
          <p>
            We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted) for analytics and functionality purposes.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Third-Party Services</h2>
          <p>
            We may use third-party services that collect, monitor, and process data independently. These include:
          </p>
          <ul>
            <li>Analytics providers (e.g., Google Analytics, Vercel Analytics)</li>
            <li>Music streaming embeds (Spotify, Apple Music, YouTube)</li>
            <li>Payment processors (for merchandise or donations, if applicable)</li>
          </ul>
          <p>
            These third parties have their own privacy policies governing the use of your data. We recommend reviewing them.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to restrict or object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us through the website contact form.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Children&apos;s Privacy</h2>
          <p>
            This website is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us so we can delete it.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Contact</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out via the contact form on the website.
          </p>
        </section>

        <hr className={styles.divider} />
      </main>
      <Footer />
    </>
  );
}
