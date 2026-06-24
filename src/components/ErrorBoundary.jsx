"use client";

import { Component } from "react";

// Error fallback component for WebGL errors
function ErrorFallback({ error, isMobile }) {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#0a0a0f",
        color: "#a0aec0",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: isMobile ? "12px" : "14px",
      }}
    >
      <p style={{ margin: "0 0 10px 0", color: "#ef4444" }}>
        ⚠️ {isMobile ? "Some visual effects are simplified on this device" : "3D content failed to load"}
      </p>
      {!isMobile && (
        <p style={{ margin: "0", fontSize: "12px", opacity: 0.7 }}>
          {error?.message || "Unable to render 3D graphics"}
        </p>
      )}
    </div>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((state) => ({ errorCount: state.errorCount + 1 }));

    // Log error for debugging
    console.warn("ErrorBoundary caught:", error.message);
    console.warn("Component stack:", errorInfo.componentStack);

    // Track repeated errors
    if (this.state.errorCount > 3) {
      console.error("Repeated errors detected, check device capabilities");
    }

    const message = typeof error?.message === "string" ? error.message : "";
    if (
      message.includes("WebGL") ||
      message.includes("context") ||
      message.includes("texture")
    ) {
      console.warn("WebGL-related error detected");
    }
  }

  render() {
    if (this.state.hasError) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

        return (
          <>
            <ErrorFallback error={this.state.error} isMobile={isMobile} />
            {this.props.children}
          </>
        );
    }

    return this.props.children;
  }
}

// Helper hook to use loading context in error boundary
export function withErrorBoundary(Component) {
  return function WrappedComponent(props) {
    // Note: This is a wrapper for future use if needed
    return <Component {...props} />;
  };
}
