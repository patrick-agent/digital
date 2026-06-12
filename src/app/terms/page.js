import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/app/legal.module.css";

export const metadata = buildPageMetadata({
  title: "Terms & Conditions | Tachy",
  description:
    "Điều khoản và điều kiện sử dụng website Tachy, bao gồm quyền nội dung, liên kết bên thứ ba, tuyên bố miễn trừ và trách nhiệm pháp lý.",
  path: "/terms",
  keywords: ["terms and conditions", "điều khoản sử dụng", "Tachy"],
})

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Terms &amp; Conditions</h1>
          <p className={styles.lastUpdated}>Last updated: May 25, 2026</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Tachy Artist website, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you must not use this website.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Intellectual Property</h2>
          <p>
            All content on this website — including music, artwork, text, images, logos, and design — is the intellectual property of Tachy unless otherwise noted. You may not reproduce, distribute, modify, or publicly display any content without prior written consent.
          </p>
          <p>
            Unauthorized use of any material may violate copyright, trademark, and other applicable laws.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Use of Content</h2>
          <p>You are permitted to:</p>
          <ul>
            <li>Stream music for personal, non-commercial use</li>
            <li>Share links to the website or its content</li>
            <li>Download material explicitly made available for download</li>
          </ul>
          <p>You may not:</p>
          <ul>
            <li>Use any content for commercial purposes without permission</li>
            <li>Modify or create derivative works from website content</li>
            <li>Attempt to circumvent any access restrictions</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. User Conduct</h2>
          <p>
            You agree not to use this website for any unlawful purpose or in any way that could damage, disable, or impair the website or interfere with other users&apos; enjoyment. Prohibited activities include but are not limited to hacking, spamming, or distributing malware.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Third-Party Links</h2>
          <p>
            This website may contain links to third-party services (e.g., Spotify, Apple Music, YouTube). We are not responsible for the content, privacy policies, or practices of these external sites. Your use of such services is at your own risk.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Disclaimer</h2>
          <p>
            The website and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied. Tachy disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
          <p>
            Tachy shall not be liable for any damages arising out of or in connection with your use of this website. This includes direct, indirect, incidental, consequential, or punitive damages, even if advised of the possibility of such damages.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these terms at any time without prior notice. Changes will be effective immediately upon posting. Your continued use of the website after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contact</h2>
          <p>
            If you have any questions about these Terms &amp; Conditions, please reach out through the contact form on the website or via our official social media channels.
          </p>
        </section>

        <hr className={styles.divider} />
      </main>
      <Footer />
    </>
  );
}
