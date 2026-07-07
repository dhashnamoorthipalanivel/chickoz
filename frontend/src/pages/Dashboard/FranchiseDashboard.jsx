import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { getFranchiseDashboardApi, getDashboardFranchisesApi } from "../../api/dashboardApi";

/* ─── CSS ───────────────────────────────────────────────────────────── */
const FR_CSS = `
  @keyframes fr-spin     { to{transform:rotate(360deg)} }
  @keyframes fr-shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes fr-up       { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fr-pop      { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }

  .fr-spin-icon          { animation:fr-spin .7s linear infinite; display:inline-block; }
  .fr-skeleton           { border-radius:8px; background:linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%); background-size:400px 100%; animation:fr-shimmer 1.4s ease-in-out infinite; }
  .fr-stat               { animation:fr-up .45s ease both; }

  /* ── Selector bar ── */
  .fr-sel-bar            { background:#fff; border:1px solid #f0f0f0; border-radius:16px; padding:18px 22px; box-shadow:0 2px 12px rgba(0,0,0,0.05); margin-bottom:20px; animation:fr-up .4s ease both; }
  .fr-sel-title          { font-size:19px; font-weight:800; color:#1a1a1a; margin:0 0 2px; }
  .fr-sel-sub            { font-size:12.5px; color:#9ca3af; margin:0; }
  .fr-sel-wrap           { position:relative; display:flex; align-items:center; }
  .fr-sel-ico            { position:absolute; left:13px; color:#D91E18; font-size:17px; pointer-events:none; z-index:2; }
  .fr-sel-input          { appearance:none; -webkit-appearance:none; width:100%; min-width:260px; padding:11px 40px 11px 38px; border:1.5px solid #ede9e0; border-radius:11px; font-size:13.5px; font-weight:600; color:#1a1a1a; background:#fff; cursor:pointer; transition:border-color .2s,box-shadow .2s; outline:none !important; }
  .fr-sel-input:focus,.fr-sel-input:focus-visible { border-color:#F97316 !important; box-shadow:0 0 0 3.5px rgba(249,115,22,0.14) !important; outline:none !important; }
  .fr-sel-arr            { position:absolute; right:13px; color:#9ca3af; font-size:16px; pointer-events:none; }

  /* ── Refresh btn ── */
  .fr-btn-refresh        { background:linear-gradient(135deg,#D91E18,#F97316); color:#fff !important; border:none; border-radius:11px; padding:11px 18px; cursor:pointer; display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:700; transition:opacity .18s,box-shadow .18s; box-shadow:0 3px 10px rgba(217,30,24,0.28); white-space:nowrap; }
  .fr-btn-refresh:hover  { opacity:.87; box-shadow:0 5px 16px rgba(217,30,24,0.38); }
  .fr-btn-refresh:disabled { opacity:.55; cursor:not-allowed; }

  /* ── Selected franchise banner ── */
  .fr-banner             { background:linear-gradient(135deg,rgba(217,30,24,0.05) 0%,rgba(249,115,22,0.05) 100%); border:1.5px solid rgba(217,30,24,0.12); border-radius:12px; padding:12px 18px; display:flex; align-items:center; gap:14px; animation:fr-pop .3s ease both; }
  .fr-banner-dot         { width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,#D91E18,#F97316); flex-shrink:0; box-shadow:0 0 0 3px rgba(217,30,24,0.15); }
  .fr-banner-name        { font-size:13.5px; font-weight:700; color:#1a1a1a; }
  .fr-banner-loc         { font-size:12px; color:#9ca3af; }
  .fr-banner-clear       { margin-left:auto; background:none; border:none; cursor:pointer; color:#9ca3af; font-size:18px; padding:0; display:flex; align-items:center; transition:color .18s; }
  .fr-banner-clear:hover { color:#D91E18; }

  /* ── Empty state franchise cards ── */
  .fr-empty              { animation:fr-up .45s ease both; }
  .fr-fcard              { border:1.5px solid #ede9e0; border-radius:14px; padding:16px 18px; background:#fff; cursor:pointer; transition:border-color .2s,box-shadow .2s,transform .2s; text-align:left; width:100%; }
  .fr-fcard:hover        { border-color:#D91E18; box-shadow:0 6px 20px rgba(217,30,24,0.1); transform:translateY(-2px); }
  .fr-fcard-ico          { width:40px; height:40px; border-radius:11px; background:linear-gradient(135deg,#D91E18,#F97316); display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
  .fr-fcard-name         { font-size:13.5px; font-weight:700; color:#1a1a1a; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fr-fcard-loc          { font-size:12px; color:#9ca3af; display:flex; align-items:center; gap:4px; }
  .fr-fcard-badge        { display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:20px; }
`;

/* ─── utils ────────────────────────────────────────────────────────── */
const fmt    = (n = 0) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtN   = (n = 0) => Number(n).toLocaleString("en-IN");
const fmtTime = (d)    => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
const capLabel = (v)   => (v || "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const Growth = ({ val }) => {
  const up = val >= 0;
  return (
    <span style={{ fontSize: 11.5, fontWeight: 700, color: up ? "#10b981" : "#ef4444", display: "inline-flex", alignItems: "center", gap: 3 }}>
      <i className={`bx bx-trending-${up ? "up" : "down"}`} style={{ fontSize: 12 }} />{Math.abs(val)}%
    </span>
  );
};

const StatCard = ({ icon, grad, label: lbl, value, sub, growth }) => (
  <div className="card mb-0" style={{ borderRadius: 14, border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
    <div className="card-body" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.18)" }}>
          <i className={`bx ${icon}`} style={{ fontSize: 22, color: "#fff" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{lbl}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {growth !== undefined && <Growth val={growth} />}
            {sub && <span style={{ fontSize: 11, color: "#9ca3af" }}>{sub}</span>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Card = ({ title, action, to, children }) => (
  <div className="card" style={{ borderRadius: 14, border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h6 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{title}</h6>
      {action && <Link to={to || "#"} style={{ fontSize: 12.5, fontWeight: 700, color: "#D91E18", textDecoration: "none" }}>{action}</Link>}
    </div>
    <div style={{ padding: "16px 20px", flex: 1 }}>{children}</div>
  </div>
);

const orderStatusCfg = {
  PENDING:   { color: "#6b7280", label: "Pending"   },
  PREPARING: { color: "#f59e0b", label: "Preparing" },
  COMPLETED: { color: "#10b981", label: "Completed" },
  CANCELLED: { color: "#D91E18", label: "Cancelled" },
};
const payColors = { CASH: "#10b981", UPI: "#8b5cf6", CARD: "#3b82f6", WALLET: "#f59e0b", OTHER: "#6b7280" };

const StatusPill = ({ status }) => {
  const c = orderStatusCfg[status] || { color: "#6b7280", label: status };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${c.color}14`, color: c.color, border: `1px solid ${c.color}33` }}>
      {c.label}
    </span>
  );
};

/* ─── Component ────────────────────────────────────────────────────── */
const FranchiseDashboard = () => {
  const user    = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = ["admin", "super_admin"].includes(user.role);

  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [franchises,   setFranchises]   = useState([]);
  const [selectedFid,  setSelectedFid]  = useState("");
  const [noFranSelect, setNoFranSelect] = useState(isAdmin);

  /* Inject CSS */
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "fr-dash-css";
    el.textContent = FR_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  /* Load franchise list for admin dropdown */
  useEffect(() => {
    if (!isAdmin) return;
    getDashboardFranchisesApi().then(r => setFranchises(r.data)).catch(() => {});
  }, [isAdmin]);

  /* Load dashboard data */
  const load = useCallback(async (fid) => {
    if (isAdmin && !fid) { setNoFranSelect(true); setLoading(false); return; }
    setNoFranSelect(false);
    setLoading(true);
    try {
      const res = await getFranchiseDashboardApi(fid || undefined);
      setData(res.data);
    } catch (_) { setData(null); }
    finally { setLoading(false); }
  }, [isAdmin]);

  /* Franchise user: load immediately; Admin: wait for selection */
  useEffect(() => {
    if (isAdmin) {
      if (selectedFid) load(selectedFid);
      else { setLoading(false); }
    } else {
      load("");
    }
  }, [selectedFid, isAdmin, load]);

  const selectedFranchise = franchises.find(f => f._id === selectedFid);
  const statusClr = { ACTIVE: "#10b981", UNDER_MAINTENANCE: "#f59e0b", INACTIVE: "#D91E18", CLOSED: "#6b7280" };

  /* ── Franchise selector bar (always visible for admin) ── */
  const FranchiseSelector = () => !isAdmin ? null : (
    <div className="fr-sel-bar">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>

        {/* Left: title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(217,30,24,0.25)", flexShrink: 0 }}>
            <i className="bx bx-store-alt" style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <p className="fr-sel-title">Franchise Dashboard</p>
            <p className="fr-sel-sub">
              {selectedFranchise
                ? `Viewing data for ${selectedFranchise.franchiseName || selectedFranchise.franchiseId}`
                : "Select a franchise to view performance data"}
            </p>
          </div>
        </div>

        {/* Right: dropdown + refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div className="fr-sel-wrap">
            <i className="bx bx-store fr-sel-ico" />
            <select
              className="fr-sel-input"
              value={selectedFid}
              onChange={e => setSelectedFid(e.target.value)}
            >
              <option value="">— Select a Franchise —</option>
              {franchises.map(f => (
                <option key={f._id} value={f._id}>
                  {f.franchiseName || f.franchiseId}{f.location ? ` · ${f.location}` : ""}
                </option>
              ))}
            </select>
            <i className="bx bx-chevron-down fr-sel-arr" />
          </div>

          {selectedFid && (
            <button
              className="fr-btn-refresh"
              onClick={() => load(selectedFid)}
              disabled={loading}
            >
              <i className={`bx bx-refresh ${loading ? "fr-spin-icon" : ""}`} />
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          )}
        </div>
      </div>

      {/* Selected franchise info banner */}
      {selectedFranchise && (
        <div className="fr-banner" style={{ marginTop: 14 }}>
          <div className="fr-banner-dot" />
          <div>
            <div className="fr-banner-name">{selectedFranchise.franchiseName || selectedFranchise.franchiseId}</div>
            {selectedFranchise.location && (
              <div className="fr-banner-loc">
                <i className="bx bx-map-pin" style={{ fontSize: 12 }} />
                {selectedFranchise.location}
              </div>
            )}
          </div>
          {selectedFranchise.status && (
            <span className="fr-fcard-badge" style={{ background: `${statusClr[selectedFranchise.status] || "#6b7280"}15`, color: statusClr[selectedFranchise.status] || "#6b7280", border: `1px solid ${statusClr[selectedFranchise.status] || "#6b7280"}28` }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusClr[selectedFranchise.status] || "#6b7280", display: "inline-block" }} />
              {selectedFranchise.status.replace(/_/g, " ")}
            </span>
          )}
          {selectedFranchise.ownerName && (
            <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>
              Owner: <strong style={{ color: "#374151" }}>{selectedFranchise.ownerName}</strong>
            </span>
          )}
          <button className="fr-banner-clear" onClick={() => setSelectedFid("")} title="Clear selection">
            <i className="bx bx-x" />
          </button>
        </div>
      )}
    </div>
  );

  /* ── No franchise selected (admin) ── */
  if (noFranSelect) return (
    <div className="fr-empty">
      <FranchiseSelector />

      {/* Intro text */}
      <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(217,30,24,0.25)", margin: "0 auto 16px" }}>
          <i className="bx bx-store-alt" style={{ color: "#fff", fontSize: 30 }} />
        </div>
        <h5 style={{ fontWeight: 800, color: "#1a1a1a", marginBottom: 6 }}>Choose a Franchise to Continue</h5>
        <p style={{ fontSize: 13.5, color: "#9ca3af", margin: 0 }}>
          Pick from the dropdown above or click any franchise card below
        </p>
      </div>

      {/* Franchise cards grid */}
      {franchises.length > 0 ? (
        <div className="row g-3">
          {franchises.map((f, i) => {
            const clr = statusClr[f.status] || "#6b7280";
            return (
              <div className="col-xl-3 col-md-4 col-sm-6" key={f._id} style={{ animationDelay: `${i * 0.04}s` }}>
                <button className="fr-fcard" onClick={() => setSelectedFid(f._id)}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div className="fr-fcard-ico">
                      <i className="bx bx-store-alt" style={{ color: "#fff", fontSize: 18 }} />
                    </div>
                    <span className="fr-fcard-badge" style={{ background: `${clr}15`, color: clr, border: `1px solid ${clr}28` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: clr, display: "inline-block" }} />
                      {(f.status || "—").replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="fr-fcard-name">{f.franchiseName || f.franchiseId}</div>
                  {f.location && (
                    <div className="fr-fcard-loc">
                      <i className="bx bx-map-pin" style={{ fontSize: 12 }} />
                      {f.location}
                    </div>
                  )}
                  {f.ownerName && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f5f5f5", fontSize: 12, color: "#9ca3af" }}>
                      <i className="bx bx-user" style={{ fontSize: 12, marginRight: 4 }} />
                      {f.ownerName}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#c4cdd6" }}>
          <i className="bx bx-store display-5 d-block mb-2" />
          <p style={{ fontSize: 14 }}>No franchises found</p>
        </div>
      )}
    </div>
  );

  /* ── Loading skeleton ── */
  if (loading) return (
    <>
      <FranchiseSelector />
      {/* skeleton stat cards */}
      <div className="row g-3 mb-4" style={{ marginTop: 8 }}>
        {[0,.06,.12,.18,.24].map(d => (
          <div className="col-xl col-md-4 col-sm-6" key={d}>
            <div className="card mb-0 fr-stat" style={{ borderRadius: 14, border: "1px solid #f0f0f0", animationDelay: `${d}s` }}>
              <div className="card-body" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div className="fr-skeleton" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="fr-skeleton" style={{ height: 11, width: "60%", borderRadius: 5, marginBottom: 10 }} />
                    <div className="fr-skeleton" style={{ height: 22, width: "45%", borderRadius: 6, marginBottom: 10 }} />
                    <div className="fr-skeleton" style={{ height: 10, width: "70%", borderRadius: 5 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* skeleton charts */}
      <div className="row g-3 mb-4">
        {[0, .06, .12].map(d => (
          <div className="col-xl-4" key={d}>
            <div className="card" style={{ borderRadius: 14, border: "1px solid #f0f0f0" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5" }}>
                <div className="fr-skeleton" style={{ height: 14, width: 140, borderRadius: 6 }} />
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div className="fr-skeleton" style={{ height: 200, borderRadius: 10 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-3">
        {[0, .06].map(d => (
          <div className="col-xl-6" key={d}>
            <div className="card" style={{ borderRadius: 14, border: "1px solid #f0f0f0" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5" }}>
                <div className="fr-skeleton" style={{ height: 14, width: 140, borderRadius: 6 }} />
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div className="fr-skeleton" style={{ height: 160, borderRadius: 10 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (!data) return (
    <>
      <FranchiseSelector />
      <div className="text-center py-5 text-muted">
        <i className="bx bx-error-circle display-4 d-block mb-2" />Failed to load data.
      </div>
    </>
  );

  const { franchise, stats, weekComparison, salesChart, orderStatus, orderType, paymentBreakdown, topItems, recentOrders } = data;
  const franStatusColor = { ACTIVE: "#10b981", UNDER_MAINTENANCE: "#f59e0b", INACTIVE: "#D91E18", CLOSED: "#6b7280" };

  /* ── Charts ── */
  const lineOpts = {
    chart: { type: "area", height: 220, toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#D91E18", "#e5e7eb"],
    stroke: { curve: "smooth", width: [2.5, 2], dashArray: [0, 5] },
    fill: {
      type: "gradient",
      gradient: { shade: "light", type: "vertical", shadeIntensity: 0.4, gradientToColors: ["#F97316", "transparent"], opacityFrom: [0.28, 0], opacityTo: [0, 0] },
    },
    xaxis: { categories: salesChart.map(d => d.day), labels: { style: { fontSize: "11px", colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`, style: { fontSize: "11px", colors: "#9ca3af" } } },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    legend: { show: true, position: "top", horizontalAlign: "right", fontSize: "12px" },
    tooltip: { y: { formatter: v => `₹${Number(v).toLocaleString("en-IN")}` } },
    series: [
      { name: "This Week", data: salesChart.map(d => d.thisWeek) },
      { name: "Last Week", data: salesChart.map(d => d.lastWeek) },
    ],
  };

  const osKeys  = Object.keys(orderStatus);
  const donutOs = {
    chart: { type: "donut", height: 200 },
    colors: osKeys.map(k => orderStatusCfg[k]?.color || "#6b7280"),
    labels: osKeys.map(k => orderStatusCfg[k]?.label || k),
    legend: { position: "bottom", fontSize: "11px" },
    plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Orders", fontSize: "12px", fontWeight: 700, formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0) } } } } },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: v => `${v} orders` } },
    series: osKeys.map(k => orderStatus[k]),
  };

  const otKeys  = Object.keys(orderType);
  const otClrs  = { DINE_IN: "#F97316", TAKE_AWAY: "#D91E18", HOME_DELIVERY: "#10b981" };
  const donutOt = {
    chart: { type: "donut", height: 200 },
    colors: otKeys.map(k => otClrs[k] || "#6b7280"),
    labels: ["Dine In", "Take Away", "Home Delivery"],
    legend: { position: "bottom", fontSize: "11px" },
    plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px", fontWeight: 700, formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0) } } } } },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: v => `${v} orders` } },
    series: otKeys.map(k => orderType[k]),
  };

  const pyKeys       = Object.keys(paymentBreakdown).filter(k => paymentBreakdown[k] > 0);
  const totalPayment = pyKeys.reduce((s, k) => s + paymentBreakdown[k], 0);
  const donutPay = {
    chart: { type: "donut", height: 180 },
    colors: pyKeys.map(k => payColors[k] || "#6b7280"),
    labels: pyKeys,
    legend: { show: false },
    plotOptions: { pie: { donut: { size: "70%" } } },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: v => `₹${Number(v).toLocaleString("en-IN")}` } },
    series: pyKeys.map(k => paymentBreakdown[k]),
  };

  return (
    <React.Fragment>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <FranchiseSelector />

      {!isAdmin && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h4 style={{ fontWeight: 800, fontSize: 20, color: "#1a1a1a", margin: 0 }}>My Dashboard</h4>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${franStatusColor[franchise?.status] || "#6b7280"}14`, color: franStatusColor[franchise?.status] || "#6b7280", border: `1px solid ${franStatusColor[franchise?.status] || "#6b7280"}33` }}>
                    {franchise?.status}
                  </span>
                </div>
                <p className="mb-0" style={{ fontSize: 13, color: "#6b7280" }}>
                  <i className="bx bx-store me-1" style={{ color: "#D91E18" }} />
                  <strong style={{ color: "#1a1a1a" }}>{franchise?.franchiseName}</strong>
                  {franchise?.location && <span> · {franchise.location}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Franchise info banner (admin viewing) */}
      {isAdmin && franchise && (
        <div className="row mb-3">
          <div className="col-12">
            <div style={{ background: "linear-gradient(135deg,rgba(217,30,24,0.06),rgba(249,115,22,0.04))", border: "1px solid rgba(217,30,24,0.15)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bx bx-store" style={{ color: "#fff", fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>{franchise.franchiseName || franchise.franchiseId}</div>
                <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                  ID: <strong>{franchise.franchiseId}</strong>
                  {franchise.ownerName && <> · Owner: <strong>{franchise.ownerName}</strong></>}
                  {franchise.location  && <> · {franchise.location}</>}
                </div>
              </div>
              <span style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${franStatusColor[franchise.status] || "#6b7280"}14`, color: franStatusColor[franchise.status] || "#6b7280", border: `1px solid ${franStatusColor[franchise.status] || "#6b7280"}30` }}>
                {capLabel(franchise.status)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="row g-3 mb-3">
        {[
          { icon: "bx-rupee",      grad: "linear-gradient(135deg,#D91E18,#F97316)", label: "Total Revenue",    value: fmt(stats.totalRevenue),    growth: stats.growth.revenue, sub: "vs yesterday" },
          { icon: "bx-receipt",    grad: "linear-gradient(135deg,#F97316,#fbbf24)", label: "Total Orders",     value: fmtN(stats.totalOrders),    growth: stats.growth.orders,  sub: "vs yesterday" },
          { icon: "bx-sun",        grad: "linear-gradient(135deg,#10b981,#34d399)", label: "Today's Revenue",  value: fmt(stats.todayRevenue),    sub: `${stats.todayOrders} orders today` },
          { icon: "bx-package",    grad: "linear-gradient(135deg,#8b5cf6,#a78bfa)", label: "Masala Requests",  value: fmtN(stats.pendingMasala),  sub: `${stats.totalMasala} total requests` },
          { icon: "bx-bar-chart",  grad: "linear-gradient(135deg,#3b82f6,#60a5fa)", label: "Avg Order Value",  value: fmt(stats.avgOrder),        sub: "per order" },
        ].map(c => (
          <div className="col-xl col-md-4 col-6" key={c.label}><StatCard {...c} /></div>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────── */}
      <div className="row g-3 mb-3">
        <div className="col-xl-6">
          <Card title="Sales Overview">
            <div style={{ display: "flex", gap: 16, marginBottom: 4, fontSize: 12, color: "#6b7280", flexWrap: "wrap" }}>
              <span><strong style={{ color: "#D91E18" }}>This Week</strong> {fmt(weekComparison.thisWeek)}</span>
              <span><strong style={{ color: "#9ca3af" }}>Last Week</strong> {fmt(weekComparison.lastWeek)}</span>
              <Growth val={weekComparison.growth} />
            </div>
            <Chart options={lineOpts} series={lineOpts.series} type="area" height={220} />
          </Card>
        </div>

        <div className="col-xl-3 col-md-6">
          <Card title="Order Status">
            <Chart options={donutOs} series={donutOs.series} type="donut" height={200} />
            <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 8px" }}>
              {osKeys.map(k => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: orderStatusCfg[k]?.color || "#6b7280", flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, color: "#374151", fontWeight: 600, flex: 1 }}>{orderStatusCfg[k]?.label}</span>
                  <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{orderStatus[k]}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-xl-3 col-md-6">
          <Card title="Order Type">
            <Chart options={donutOt} series={donutOt.series} type="donut" height={200} />
            <div style={{ marginTop: 8 }}>
              {[{ key: "DINE_IN", label: "Dine In" }, { key: "TAKE_AWAY", label: "Take Away" }, { key: "HOME_DELIVERY", label: "Home Delivery" }].map(r => {
                const total = Object.values(orderType).reduce((a, b) => a + b, 0);
                const pct   = total ? ((orderType[r.key] / total) * 100).toFixed(1) : 0;
                return (
                  <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: otClrs[r.key], flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 600, flex: 1 }}>{r.label}</span>
                    <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Bottom row ─────────────────────────────────────────────── */}
      <div className="row g-3 mb-3">
        <div className="col-xl-3 col-md-6">
          <Card title="Top Selling Items" action="View All" to="/store-management-orders">
            {topItems.length === 0 ? (
              <div className="text-center text-muted py-4" style={{ fontSize: 13 }}>No orders yet</div>
            ) : topItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < topItems.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="bx bx-bowl-hot" style={{ color: "#fff", fontSize: 15 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.qty} sold</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#D91E18" }}>{fmt(item.revenue)}</div>
              </div>
            ))}
          </Card>
        </div>

        <div className="col-xl-6">
          <Card title="Recent Orders" action="View All" to="/store-management-orders">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f5f5f5" }}>
                    {["Order #", "Customer", "Type", "Amount", "Status", "Time"].map(h => (
                      <th key={h} style={{ padding: "6px 8px", textAlign: "left", fontWeight: 700, fontSize: 11.5, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: "center", padding: 24, color: "#9ca3af" }}>No orders yet</td></tr>
                  ) : recentOrders.map(o => (
                    <tr key={o._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                      <td style={{ padding: "8px 8px", fontWeight: 700, color: "#D91E18", whiteSpace: "nowrap" }}>{o.orderNumber}</td>
                      <td style={{ padding: "8px 8px", color: "#374151", fontWeight: 600, whiteSpace: "nowrap", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>{o.customerName}</td>
                      <td style={{ padding: "8px 8px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: otClrs[o.orderType] || "#6b7280" }}>{capLabel(o.orderType)}</span>
                      </td>
                      <td style={{ padding: "8px 8px", fontWeight: 800, color: "#059669", whiteSpace: "nowrap" }}>{fmt(o.totalAmount)}</td>
                      <td style={{ padding: "8px 8px" }}><StatusPill status={o.orderStatus} /></td>
                      <td style={{ padding: "8px 8px", color: "#9ca3af", whiteSpace: "nowrap" }}>{fmtTime(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="col-xl-3 col-md-6">
          <Card title="Payment Summary">
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>{fmt(totalPayment)}</div>
            <div style={{ fontSize: 11.5, color: "#9ca3af", marginBottom: 10 }}>Total Collected</div>
            {pyKeys.length > 0
              ? <Chart options={donutPay} series={donutPay.series} type="donut" height={180} />
              : <div className="text-center text-muted py-3" style={{ fontSize: 13 }}>No payments yet</div>
            }
            <div style={{ marginTop: 8 }}>
              {pyKeys.map(k => {
                const pct = totalPayment ? ((paymentBreakdown[k] / totalPayment) * 100).toFixed(1) : 0;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: payColors[k] || "#6b7280", flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", flex: 1 }}>{k}</span>
                    <span style={{ fontSize: 11.5, color: "#6b7280" }}>{fmt(paymentBreakdown[k])}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Quick links ────────────────────────────────────────────── */}
      <div className="row g-3">
        {[
          { icon: "bx-receipt",      color: "#D91E18", bg: "rgba(217,30,24,0.08)",  border: "rgba(217,30,24,0.2)",  title: "Today's Orders",   value: fmtN(stats.todayOrders), sub: fmt(stats.todayRevenue) + " revenue",       link: "/store-management-orders"              },
          { icon: "bx-package",      color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)", title: "Masala Requests",  value: fmtN(stats.pendingMasala), sub: "Pending",                                  link: "/manufacture-masala-franchise-request" },
          { icon: "bx-trending-up",  color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", title: "This Week Sales",  value: fmt(weekComparison.thisWeek), sub: <Growth val={weekComparison.growth} />, link: "/store-management-orders"              },
          { icon: "bx-bar-chart",    color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", title: "Avg Order Value",  value: fmt(stats.avgOrder),      sub: "per order",                               link: "/store-management-orders"              },
        ].map(c => (
          <div className="col-xl-3 col-md-6" key={c.title}>
            <div className="card mb-0" style={{ borderRadius: 14, border: `1px solid ${c.border}`, background: c.bg, boxShadow: "none" }}>
              <div className="card-body" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.title}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{c.value}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{c.sub}</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`bx ${c.icon}`} style={{ color: c.color, fontSize: 21 }} />
                  </div>
                </div>
                <Link to={c.link} style={{ fontSize: 12.5, fontWeight: 700, color: c.color, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 12 }}>
                  View All <i className="bx bx-right-arrow-alt" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default FranchiseDashboard;
