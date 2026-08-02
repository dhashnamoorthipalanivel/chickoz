import React from "react";

const SubscriptionExpired = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0d0d0d,#1a0808,#1c0d05)", padding: 24 }}>
    <div style={{ textAlign: "center", maxWidth: 520 }}>
      {/* pulsing icon */}
      <div style={{ position: "relative", display: "inline-flex", marginBottom: 32 }}>
        <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "2px solid rgba(217,30,24,0.3)", animation: "pulse 2s ease infinite" }} />
        <div style={{ position: "absolute", inset: -28, borderRadius: "50%", border: "1px solid rgba(217,30,24,0.12)" }} />
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#D91E18,#991B1B)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 40px rgba(217,30,24,0.45)" }}>
          <i className="bx bx-lock-alt" style={{ color: "#fff", fontSize: 40 }} />
        </div>
      </div>

      <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 28, marginBottom: 12 }}>Subscription Expired</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Your franchise subscription has expired or has not been activated.<br />
        Please contact your <span style={{ color: "#F97316", fontWeight: 700 }}>Chickoz Admin</span> to renew or enable your subscription.
      </p>

      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
        {[
          { icon: "bx bx-phone", label: "Call Admin", val: "+91 XXXXX XXXXX" },
          { icon: "bx bx-envelope", label: "Email", val: "admin@chickoz.com" },
        ].map(({ icon, label, val }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, lastChild: { marginBottom: 0 } }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={icon} style={{ color: "#F97316", fontSize: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { localStorage.clear(); window.location.href = "/"; }}
        style={{ padding: "12px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
        <i className="bx bx-log-out me-2" />Sign Out
      </button>
    </div>

    <style>{`@keyframes pulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.5);opacity:0} }`}</style>
  </div>
);

export default SubscriptionExpired;
