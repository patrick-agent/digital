"use client";

export default function SectionTitle({
  label,
  subtitle,
  align = "center",
  className = "",
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        marginBottom: "3rem",
      }}
    >
      {subtitle && (
        <span
          style={{
            fontFamily: "var(--font-mono-ui)",
            fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
            color: "var(--accent-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "4px 14px",
            background: "rgba(var(--brand-primary-rgb), 0.08)",
            border: "1px solid rgba(var(--brand-primary-rgb), 0.15)",
            borderRadius: "9999px",
          }}
        >
          {subtitle}
        </span>
      )}
      <h2
        style={{
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          fontFamily: "var(--font-heading)",
          background: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 50%, var(--accent-tertiary) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {label}
      </h2>
    </div>
  );
}
