import React from "react";

const CircularLoader = ({ size = "md", message = "Loading...", overlay = false }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const diameter = isSm ? 22 : isLg ? 68 : 46;
  const strokeWidth = isSm ? 3 : isLg ? 5 : 4;

  const content = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isSm ? 0 : 24, gap: 12 }}>
      <div style={{ position: "relative", width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          viewBox="0 0 50 50"
          style={{ animation: "chickoz-spin 0.9s linear infinite" }}
        >
          <defs>
            <linearGradient id="chickoz-loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D91E18" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FFB703" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#chickoz-loader-grad)"
            strokeWidth={strokeWidth}
            strokeDasharray="90 150"
            strokeLinecap="round"
          />
        </svg>

        {!isSm && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: diameter * 0.32,
              height: diameter * 0.32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D91E18, #F97316)",
              boxShadow: "0 0 10px rgba(217,30,24,0.4)",
              animation: "chickoz-pulse 1.2s ease-in-out infinite"
            }}
          />
        )}
      </div>

      {message && !isSm && (
        <span style={{ fontSize: isLg ? 14 : 12.5, fontWeight: 700, color: "#4b5563", letterSpacing: 0.3 }}>
          {message}
        </span>
      )}

      <style>{`
        @keyframes chickoz-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes chickoz-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (overlay) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.78)",
        backdropFilter: "blur(4px)",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
          border: "1px solid #f1f5f9",
          padding: 12
        }}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default CircularLoader;
