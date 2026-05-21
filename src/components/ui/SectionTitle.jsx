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
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
            color: "#a855f7",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "4px 14px",
            background: "rgba(168, 85, 247, 0.08)",
            border: "1px solid rgba(168, 85, 247, 0.15)",
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
          background: "linear-gradient(135deg, #f0f0f5 0%, #a855f7 50%, #ec4899 100%)",
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
