"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#0f172a", color: "#e2e8f0" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
        <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
