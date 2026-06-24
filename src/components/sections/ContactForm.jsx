import { useState } from "react";
import styles from "./ContactSection.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setError("");

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Vui lòng điền đầy đủ thông tin!");
      setFormStatus("idle");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ!");
      setFormStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setError(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
        setFormStatus("error");
      }
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
      setFormStatus("error");
    }
  };

  if (formStatus === "success") {
    return <div className={styles.successMessage}>Cảm ơn bạn! Tin nhắn đã được ghi nhận thành công.</div>;
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required placeholder="Your name…"
          value={formData.name} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="your@email.com…"
          value={formData.email} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="subject">Subject</label>
        <input type="text" id="subject" name="subject" required placeholder="Subject…"
          value={formData.subject} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required placeholder="Your message…"
          value={formData.message} onChange={handleInputChange} />
      </div>
      {error && <div id="form-error" className={styles.errorMessage} role="alert">{error}</div>}
      <button type="submit" className={styles.submitBtn} disabled={formStatus === "submitting"}>
        {formStatus === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
