import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { getAdminDashboardApi } from "../../api/dashboardApi";

/* ─── CSS ───────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes adm-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes adm-in   { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes adm-pop  { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  @keyframes adm-spin  { to{transform:rotate(360deg)} }
  @keyframes adm-bar   { from{width:0} to{width:var(--w)} }
  @keyframes adm-pulse { 0%,100%{opacity:.9} 50%{opacity:.5} }
  @keyframes adm-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .adm-page            { animation:adm-up .55s ease both; }
  .adm-stat            { animation:adm-up .5s ease both; transition:transform .2s,box-shadow .2s; border-radius:16px !important; overflow:hidden; }
  .adm-stat:hover      { transform:translateY(-4px); box-shadow:0 12px 28px rgba(0,0,0,0.1) !important; }
  .adm-card            { border-radius:16px !important; overflow:hidden; transition:box-shadow .2s; }
  .adm-card:hover      { box-shadow:0 8px 24px rgba(0,0,0,0.09) !important; }
  .adm-tr              { transition:background .15s; }
  .adm-tr:hover        { background:#fafafa !important; }
  .adm-link            { transition:gap .18s,opacity .18s; display:inline-flex; align-items:center; gap:4px; text-decoration:none; font-weight:700; font-size:12.5px; }
  .adm-link:hover      { gap:8px; opacity:.8; }
  .adm-bar-fill        { height:100%; border-radius:4px; animation:adm-bar .8s .3s ease both; }
  .adm-icon-wrap       { transition:transform .2s; }
  .adm-stat:hover .adm-icon-wrap { transform:scale(1.08) rotate(-4deg); }
  .adm-btn-outline     { background:#fff; border:1.5px solid #e5e7eb; border-radius:10px; padding:7px 14px; font-size:12.5px; font-weight:700; cursor:pointer; transition:border-color .18s,color .18s,opacity .18s; color:#374151; display:inline-flex; align-items:center; gap:6px; }
  .adm-btn-outline:hover { border-color:#D91E18; color:#D91E18; }
  .adm-btn-outline:disabled { opacity:.6; cursor:not-allowed; }
  .adm-btn-primary     { background:linear-gradient(135deg,#D91E18,#F97316); color:#fff !important; border:none; border-radius:10px; padding:7px 16px; font-size:12.5px; font-weight:800; cursor:pointer; transition:opacity .18s,box-shadow .18s; display:inline-flex; align-items:center; gap:6px; box-shadow:0 3px 10px rgba(217,30,24,0.3); text-decoration:none !important; }
  .adm-btn-primary:hover { opacity:.88; box-shadow:0 5px 16px rgba(217,30,24,0.4); color:#fff !important; }
  .adm-btn-primary:disabled { opacity:.6; cursor:not-allowed; }
  .adm-spin-icon       { animation:adm-spin .7s linear infinite; display:inline-block; }
  .adm-skeleton        { border-radius:8px; background:linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%); background-size:400px 100%; animation:adm-shimmer 1.4s ease-in-out infinite; }
  .adm-section-label   { font-size:10.5px; font-weight:800; letter-spacing:1.4px; text-transform:uppercase; color:#9ca3af; margin-bottom:14px; }
`;

/* ─── utils ─────────────────────────────────────────────────────────── */
const fmtN    = (n = 0) => Number(n).toLocaleString("en-IN");
const fmtDate = (d)     => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const cap     = (v)     => (v || "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const enqColors    = { NEW: "#3b82f6", FOLLOW_UP: "#f59e0b", HOLD: "#6b7280", CANCELLED: "#ef4444", CONVERTED_TO_LEAD: "#10b981" };
const leadColors   = { NEW: "#3b82f6", IN_PROGRESS: "#F97316", HOLD: "#6b7280", CANCELLED: "#ef4444", RETURN: "#8b5cf6", COMPLETED: "#10b981" };
const masalaColors = { REQUESTED: "#3b82f6", UNDER_REVIEW: "#f59e0b", APPROVED: "#10b981", PROCESSING: "#F97316", DISPATCHED: "#8b5cf6", DELIVERED: "#059669", REJECTED: "#ef4444", CANCELLED: "#6b7280" };
const franClrs     = { ACTIVE: "#10b981", UNDER_MAINTENANCE: "#f59e0b", INACTIVE: "#D91E18", CLOSED: "#6b7280" };

const Pill = ({ status, colorMap }) => {
  const c = colorMap[status] || "#6b7280";
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: `${c}15`, color: c, border: `1px solid ${c}28`, whiteSpace: "nowrap", letterSpacing: .2 }}>
      {cap(status)}
    </span>
  );
};

/* ─── Stat card ─────────────────────────────────────────────────────── */
const StatCard = ({ icon, grad, label: lbl, value, sub, tag, delay = 0 }) => (
  <div className="card mb-0 adm-stat" style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", animationDelay: `${delay}s` }}>
    <div className="card-body" style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: .3 }}>{lbl}</div>
        <div className="adm-icon-wrap" style={{ width: 44, height: 44, borderRadius: 13, background: grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
          <i className={`bx ${icon}`} style={{ fontSize: 21, color: "#fff" }} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#111", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{sub}</div>
      {tag && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 6 }}>
          {tag}
        </div>
      )}
    </div>
  </div>
);

/* ─── Section card ──────────────────────────────────────────────────── */
const SCard = ({ title, icon, iconColor = "#D91E18", action, to, delay = 0, children, noPad }) => (
  <div className="card adm-card" style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column", animation: `adm-pop .5s ${delay}s ease both` }}>
    <div style={{ padding: "15px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${iconColor}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`bx ${icon}`} style={{ fontSize: 16, color: iconColor }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{title}</span>
      </div>
      {action && (
        <Link to={to || "#"} className="adm-link" style={{ color: "#D91E18" }}>
          {action} <i className="bx bx-right-arrow-alt" style={{ fontSize: 15 }} />
        </Link>
      )}
    </div>
    <div style={{ padding: noPad ? 0 : "16px 20px", flex: 1, overflow: "hidden" }}>{children}</div>
  </div>
);

/* ─── Progress bar row ──────────────────────────────────────────────── */
const BarRow = ({ label: lbl, value, total, color }) => {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{lbl}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color }}>
          {value} <span style={{ color: "#9ca3af", fontWeight: 500 }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: "#f3f4f6", overflow: "hidden" }}>
        <div className="adm-bar-fill" style={{ "--w": `${pct}%`, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

/* ─── Table ─────────────────────────────────────────────────────────── */
const DTable = ({ heads, rows, empty }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
      <thead>
        <tr style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
          {heads.map(h => (
            <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, fontSize: 11.5, color: "#6b7280", whiteSpace: "nowrap", letterSpacing: .2 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={heads.length} style={{ textAlign: "center", padding: "28px 12px", color: "#c4cdd6", fontSize: 13 }}><i className="bx bx-data d-block mb-1" style={{ fontSize: 28 }} />{empty}</td></tr>
          : rows.map((r, i) => <tr key={i} className="adm-tr" style={{ borderBottom: "1px solid #f5f5f5" }}>{r}</tr>)
        }
      </tbody>
    </table>
  </div>
);

const Td = ({ children, bold, red, muted, nowrap }) => (
  <td style={{ padding: "9px 12px", fontWeight: bold ? 700 : 500, color: red ? "#D91E18" : muted ? "#9ca3af" : "#374151", whiteSpace: nowrap ? "nowrap" : undefined }}>
    {children}
  </td>
);

/* ════════════════════════════════════════════════════════════════════ */
/* ── Skeleton block ─────────────────────────────────────────────────── */
const SkeletonCard = ({ h = 90, delay = 0 }) => (
  <div className="card mb-0" style={{ borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden", animationDelay: `${delay}s` }}>
    <div className="card-body" style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div className="adm-skeleton" style={{ height: 12, width: "55%", borderRadius: 6 }} />
        <div className="adm-skeleton" style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0 }} />
      </div>
      <div className="adm-skeleton" style={{ height: 28, width: "40%", borderRadius: 6, marginBottom: 10 }} />
      <div className="adm-skeleton" style={{ height: 10, width: "70%", borderRadius: 6, marginBottom: 14 }} />
      <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: 10 }}>
        <div className="adm-skeleton" style={{ height: 10, width: "50%", borderRadius: 6 }} />
      </div>
    </div>
  </div>
);

const SkeletonSection = ({ h = 260, delay = 0 }) => (
  <div className="card adm-card" style={{ border: "1px solid #f0f0f0", animationDelay: `${delay}s` }}>
    <div style={{ padding: "15px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="adm-skeleton" style={{ width: 32, height: 32, borderRadius: 9 }} />
        <div className="adm-skeleton" style={{ height: 14, width: 120, borderRadius: 6 }} />
      </div>
      <div className="adm-skeleton" style={{ height: 12, width: 60, borderRadius: 6 }} />
    </div>
    <div style={{ padding: "16px 20px" }}>
      <div className="adm-skeleton" style={{ height: h, borderRadius: 10 }} />
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "adm-dash-css";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const fetchData = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    getAdminDashboardApi()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { fetchData(false); }, []);

  /* ── Loading skeleton ── */
  if (loading) return (
    <div>
      {/* skeleton header */}
      <div className="row mb-4">
        <div className="col-12">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="adm-skeleton" style={{ width: 42, height: 42, borderRadius: 12 }} />
              <div>
                <div className="adm-skeleton" style={{ height: 20, width: 160, borderRadius: 6, marginBottom: 8 }} />
                <div className="adm-skeleton" style={{ height: 12, width: 240, borderRadius: 5 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="adm-skeleton" style={{ height: 36, width: 100, borderRadius: 10 }} />
              <div className="adm-skeleton" style={{ height: 36, width: 130, borderRadius: 10 }} />
            </div>
          </div>
        </div>
      </div>
      {/* skeleton stat cards */}
      <div className="row g-3 mb-4">
        {[0,.06,.12,.18,.24].map(d => (
          <div className="col-xl col-md-4 col-sm-6" key={d}><SkeletonCard delay={d} /></div>
        ))}
      </div>
      {/* skeleton sections */}
      <div className="row g-3 mb-4">
        <div className="col-xl-5"><SkeletonSection h={240} delay={0} /></div>
        <div className="col-xl-3"><SkeletonSection h={240} delay={.05} /></div>
        <div className="col-xl-4"><SkeletonSection h={240} delay={.1} /></div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-xl-4"><SkeletonSection h={220} delay={.05} /></div>
        <div className="col-xl-8"><SkeletonSection h={220} delay={.1} /></div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-xl-6"><SkeletonSection h={180} delay={.05} /></div>
        <div className="col-xl-6"><SkeletonSection h={180} delay={.1} /></div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="text-center py-5 text-muted">
      <i className="bx bx-error-circle display-4 d-block mb-2" />Failed to load dashboard.
    </div>
  );

  const { stats, enquiryStatus, leadStatus, franchiseStatus, masalaStatus, recentEnquiries, recentLeads, franchiseList, recentMasala } = data;

  /* ── Chart: Enquiry column ── */
  const enqKeys    = ["NEW", "FOLLOW_UP", "HOLD", "CONVERTED_TO_LEAD", "CANCELLED"];
  const enqBarOpts = {
    chart: { type: "bar", height: 190, toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
    colors: enqKeys.map(k => enqColors[k]),
    plotOptions: { bar: { columnWidth: "52%", borderRadius: 6, distributed: true } },
    xaxis: { categories: ["New", "Follow Up", "Hold", "Converted", "Cancelled"], labels: { style: { fontSize: "10px", colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" } } },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    legend: { show: false },
    dataLabels: { enabled: true, style: { fontSize: "10px", fontWeight: 700 }, offsetY: -4 },
    tooltip: { y: { formatter: v => `${v} enquiries` } },
    series: [{ name: "Enquiries", data: enqKeys.map(k => enquiryStatus[k] || 0) }],
  };

  /* ── Chart: Masala column ── */
  const masalaActiveKeys = ["REQUESTED", "UNDER_REVIEW", "APPROVED", "PROCESSING", "DISPATCHED", "DELIVERED"];
  const masalaBarOpts    = {
    chart: { type: "bar", height: 190, toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
    colors: masalaActiveKeys.map(k => masalaColors[k]),
    plotOptions: { bar: { columnWidth: "48%", borderRadius: 6, distributed: true } },
    xaxis: { categories: ["Requested", "Review", "Approved", "Processing", "Dispatched", "Delivered"], labels: { style: { fontSize: "9px", colors: "#9ca3af" }, rotate: -20 }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" } } },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    legend: { show: false },
    dataLabels: { enabled: true, style: { fontSize: "10px", fontWeight: 700 }, offsetY: -4 },
    tooltip: { y: { formatter: v => `${v} requests` } },
    series: [{ name: "Requests", data: masalaActiveKeys.map(k => masalaStatus[k] || 0) }],
  };

  /* ── Chart: Franchise donut ── */
  const franKeys  = ["ACTIVE", "UNDER_MAINTENANCE", "INACTIVE", "CLOSED"];
  const donutFran = {
    chart: { type: "donut", height: 200, animations: { enabled: true, speed: 700 } },
    colors: franKeys.map(k => franClrs[k]),
    labels: franKeys.map(cap),
    legend: { show: false },
    plotOptions: { pie: { donut: { size: "74%", labels: { show: true,
      name:  { fontSize: "13px", fontWeight: 700, color: "#374151", offsetY: -4 },
      value: { fontSize: "22px", fontWeight: 800, color: "#1a1a1a",  offsetY:  4, formatter: v => v },
      total: { show: true, label: "Total", fontSize: "12px", fontWeight: 700, color: "#9ca3af", formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0) },
    } } } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: { y: { formatter: v => `${v} franchises` } },
    series: franKeys.map(k => franchiseStatus[k] || 0),
  };

  /* ── Lead pipeline total ── */
  const leadKeys  = ["NEW", "IN_PROGRESS", "HOLD", "COMPLETED", "CANCELLED", "RETURN"];
  const totalLeads = leadKeys.reduce((s, k) => s + (leadStatus[k] || 0), 0);

  return (
    <React.Fragment>
      <div className="adm-page">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="row mb-4">
          <div className="col-12">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(217,30,24,0.3)" }}>
                    <i className="bx bx-tachometer" style={{ color: "#fff", fontSize: 21 }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: "#1a1a1a" }}>Admin Dashboard</h4>
                    <p style={{ margin: 0, fontSize: 12.5, color: "#9ca3af" }}>
                      Welcome back, <strong style={{ color: "#D91E18" }}>{user.firstName || "Admin"}</strong> &nbsp;·&nbsp;
                      {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="adm-btn-outline"
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                >
                  <i className={`bx bx-refresh ${refreshing ? "adm-spin-icon" : ""}`} />
                  {refreshing ? "Refreshing…" : "Refresh"}
                </button>
                <Link to="/crm-enquiry" className="adm-btn-primary" style={{ color: "#fff", textDecoration: "none" }}>
                  <i className="bx bx-plus" style={{ fontSize: 15, color: "#fff" }} />
                  Add Enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat cards ─────────────────────────────────────────── */}
        <div className="row g-3 mb-4">
          {[
            {
              icon: "bx-message-square-dots", grad: "linear-gradient(135deg,#3b82f6,#60a5fa)",
              label: "Total Enquiries", value: fmtN(stats.totalEnquiries),
              sub: `${stats.newEnquiries} new enquiries today`,
              tag: <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: "#3b82f6", fontWeight: 700 }}>{stats.convertedEnquiries} converted to lead</span></>,
              delay: 0,
            },
            {
              icon: "bx-user-pin", grad: "linear-gradient(135deg,#F97316,#fbbf24)",
              label: "Total Leads", value: fmtN(stats.totalLeads),
              sub: `${stats.newLeads} new · ${stats.inProgressLeads} in progress`,
              tag: <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: "#10b981", fontWeight: 700 }}>{stats.completedLeads} completed</span></>,
              delay: .06,
            },
            {
              icon: "bx-store-alt", grad: "linear-gradient(135deg,#10b981,#34d399)",
              label: "Active Franchises", value: fmtN(stats.activeFranchises),
              sub: `of ${stats.totalFranchises} total franchises`,
              tag: <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#D91E18", flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: "#D91E18", fontWeight: 700 }}>{stats.inactiveFranchises} inactive</span></>,
              delay: .12,
            },
            {
              icon: "bx-package", grad: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
              label: "Masala Requests", value: fmtN(stats.totalMasala),
              sub: `${stats.pendingMasala} pending review`,
              tag: <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: "#059669", fontWeight: 700 }}>{stats.deliveredMasala} delivered</span></>,
              delay: .18,
            },
            {
              icon: "bx-transfer-alt", grad: "linear-gradient(135deg,#D91E18,#F97316)",
              label: "Lead Conversions", value: fmtN(stats.completedLeads),
              sub: "Leads completed / franchise created",
              tag: <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: "#3b82f6", fontWeight: 700 }}>{stats.convertedEnquiries} from enquiry</span></>,
              delay: .24,
            },
          ].map(c => (
            <div className="col-xl col-md-4 col-sm-6" key={c.label}>
              <StatCard {...c} />
            </div>
          ))}
        </div>

        {/* ── Row 2: Enquiry chart + Franchise donut + Lead pipeline ─ */}
        <div className="row g-3 mb-4">

          {/* Enquiry bar chart */}
          <div className="col-xl-5 col-md-12">
            <SCard title="Enquiry Breakdown" icon="bx-message-square-dots" iconColor="#3b82f6" action="View All" to="/crm-enquiry" delay={.05}>
              <div className="adm-section-label">By Status — All Time</div>
              <Chart options={enqBarOpts} series={enqBarOpts.series} type="bar" height={190} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                {enqKeys.map(k => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: enqColors[k], flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{cap(k)}: <strong style={{ color: "#1a1a1a" }}>{enquiryStatus[k] || 0}</strong></span>
                  </div>
                ))}
              </div>
            </SCard>
          </div>

          {/* Franchise status donut */}
          <div className="col-xl-3 col-md-6">
            <SCard title="Franchise Status" icon="bx-store-alt" iconColor="#10b981" action="View All" to="/master-franchise" delay={.1}>
              <Chart options={donutFran} series={donutFran.series} type="donut" height={200} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", marginTop: 10 }}>
                {franKeys.map(k => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, background: `${franClrs[k]}0d`, borderRadius: 8, padding: "6px 10px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: franClrs[k], flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, lineHeight: 1 }}>{cap(k)}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: franClrs[k], lineHeight: 1.3 }}>{franchiseStatus[k] || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SCard>
          </div>

          {/* Lead pipeline progress bars */}
          <div className="col-xl-4 col-md-6">
            <SCard title="Lead Pipeline" icon="bx-user-pin" iconColor="#F97316" action="View All" to="/crm-lead" delay={.15}>
              <div className="adm-section-label">Stage Distribution</div>
              <BarRow label="New"         value={leadStatus.NEW        || 0} total={totalLeads} color={leadColors.NEW}         />
              <BarRow label="In Progress" value={leadStatus.IN_PROGRESS || 0} total={totalLeads} color={leadColors.IN_PROGRESS} />
              <BarRow label="Completed"   value={leadStatus.COMPLETED  || 0} total={totalLeads} color={leadColors.COMPLETED}   />
              <BarRow label="Hold"        value={leadStatus.HOLD       || 0} total={totalLeads} color={leadColors.HOLD}        />
              <BarRow label="Cancelled"   value={leadStatus.CANCELLED  || 0} total={totalLeads} color={leadColors.CANCELLED}   />
              <BarRow label="Return"      value={leadStatus.RETURN     || 0} total={totalLeads} color={leadColors.RETURN}      />
            </SCard>
          </div>
        </div>

        {/* ── Row 3: Masala chart + Recent Enquiries ─────────────── */}
        <div className="row g-3 mb-4">

          {/* Masala bar chart */}
          <div className="col-xl-4 col-md-12">
            <SCard title="Masala Request Pipeline" icon="bx-package" iconColor="#8b5cf6" action="View All" to="/manufacture-masala-admin-process" delay={.08}>
              <div className="adm-section-label">Request Status Flow</div>
              <Chart options={masalaBarOpts} series={masalaBarOpts.series} type="bar" height={190} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", marginTop: 8 }}>
                {masalaActiveKeys.map(k => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: masalaColors[k], flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: "#6b7280" }}>{cap(k)}: <strong style={{ color: "#1a1a1a" }}>{masalaStatus[k] || 0}</strong></span>
                  </div>
                ))}
              </div>
            </SCard>
          </div>

          {/* Recent Enquiries */}
          <div className="col-xl-8 col-md-12">
            <SCard title="Recent Enquiries" icon="bx-list-ul" iconColor="#3b82f6" action="View All" to="/crm-enquiry" delay={.12} noPad>
              <DTable
                heads={["Ref ID", "Name", "Phone", "Place", "Status", "Date"]}
                empty="No enquiries yet"
                rows={recentEnquiries.map(e => [
                  <Td key="id"   red nowrap>{e.referenceId || "—"}</Td>,
                  <Td key="name" bold nowrap>{e.name}</Td>,
                  <Td key="ph"   muted>{e.phone}</Td>,
                  <Td key="pl"   muted nowrap>{e.place}</Td>,
                  <td key="st"   style={{ padding: "9px 12px" }}><Pill status={e.status} colorMap={enqColors} /></td>,
                  <Td key="dt"   muted nowrap>{fmtDate(e.createdAt)}</Td>,
                ])}
              />
            </SCard>
          </div>
        </div>

        {/* ── Row 4: Recent Leads + Franchises ───────────────────── */}
        <div className="row g-3 mb-4">

          {/* Recent Leads */}
          <div className="col-xl-6">
            <SCard title="Recent Leads" icon="bx-user-voice" iconColor="#F97316" action="View All" to="/crm-lead" delay={.06} noPad>
              <DTable
                heads={["Ref ID", "Name", "Place", "Status", "Date"]}
                empty="No leads yet"
                rows={recentLeads.map(l => [
                  <Td key="id"   red nowrap>{l.referenceId}</Td>,
                  <Td key="nm"   bold nowrap>{l.name}</Td>,
                  <Td key="pl"   muted nowrap>{l.place}</Td>,
                  <td key="st"   style={{ padding: "9px 12px" }}><Pill status={l.leadStatus} colorMap={leadColors} /></td>,
                  <Td key="dt"   muted nowrap>{fmtDate(l.createdAt)}</Td>,
                ])}
              />
            </SCard>
          </div>

          {/* Recent Franchises */}
          <div className="col-xl-6">
            <SCard title="Recent Franchises" icon="bx-store-alt" iconColor="#10b981" action="View All" to="/master-franchise" delay={.1} noPad>
              <DTable
                heads={["ID", "Name", "Owner", "Location", "Status"]}
                empty="No franchises yet"
                rows={franchiseList.map(f => [
                  <Td key="id" red nowrap>{f.franchiseId}</Td>,
                  <Td key="nm" bold nowrap>{f.franchiseName || "—"}</Td>,
                  <Td key="ow" muted nowrap>{f.ownerName}</Td>,
                  <Td key="lc" muted nowrap>{f.location || "—"}</Td>,
                  <td key="st" style={{ padding: "9px 12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: `${franClrs[f.status] || "#6b7280"}15`, color: franClrs[f.status] || "#6b7280", border: `1px solid ${franClrs[f.status] || "#6b7280"}28` }}>
                      {cap(f.status)}
                    </span>
                  </td>,
                ])}
              />
            </SCard>
          </div>
        </div>

        {/* ── Row 5: Recent Masala ────────────────────────────────── */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <SCard title="Recent Masala Requests" icon="bx-package" iconColor="#8b5cf6" action="View All" to="/manufacture-masala-admin-process" delay={.05} noPad>
              <DTable
                heads={["Request ID", "Franchise", "Total Amount", "Items", "Priority", "Status", "Date"]}
                empty="No masala requests yet"
                rows={recentMasala.map(m => [
                  <Td key="id"  red nowrap>{m.requestId || "—"}</Td>,
                  <Td key="fr"  bold nowrap>{m.franchise?.franchiseName || "—"}</Td>,
                  <td key="am"  style={{ padding: "9px 12px", fontWeight: 800, color: "#059669", whiteSpace: "nowrap" }}>₹{Number(m.totalAmount || 0).toLocaleString("en-IN")}</td>,
                  <Td key="it"  muted>{m.totalItems || 0} items</Td>,
                  <td key="pr"  style={{ padding: "9px 12px" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: m.priority === "Urgent" ? "rgba(217,30,24,0.1)" : "#f3f4f6", color: m.priority === "Urgent" ? "#D91E18" : "#6b7280", border: `1px solid ${m.priority === "Urgent" ? "rgba(217,30,24,0.25)" : "#e5e7eb"}` }}>
                      {m.priority === "Urgent" ? "⚡ Urgent" : "Normal"}
                    </span>
                  </td>,
                  <td key="st"  style={{ padding: "9px 12px" }}><Pill status={m.status} colorMap={masalaColors} /></td>,
                  <Td key="dt"  muted nowrap>{fmtDate(m.createdAt)}</Td>,
                ])}
              />
            </SCard>
          </div>
        </div>

        {/* ── Quick action strip ──────────────────────────────────── */}
        <div className="row g-3">
          {[
            { icon: "bx-message-square-dots", color: "#3b82f6", bg: "rgba(59,130,246,0.07)",  border: "rgba(59,130,246,0.18)",  title: "Enquiries",        value: fmtN(stats.totalEnquiries),  sub: `${stats.newEnquiries} new today`,         link: "/crm-enquiry",                        delay: .04 },
            { icon: "bx-user-pin",            color: "#F97316", bg: "rgba(249,115,22,0.07)",  border: "rgba(249,115,22,0.18)",  title: "Leads",            value: fmtN(stats.totalLeads),       sub: `${stats.inProgressLeads} in progress`,    link: "/crm-lead",                           delay: .08 },
            { icon: "bx-store-alt",           color: "#10b981", bg: "rgba(16,185,129,0.07)",  border: "rgba(16,185,129,0.18)",  title: "Franchises",       value: fmtN(stats.activeFranchises), sub: `${stats.inactiveFranchises} inactive`,    link: "/master-franchise",                   delay: .12 },
            { icon: "bx-package",             color: "#8b5cf6", bg: "rgba(139,92,246,0.07)",  border: "rgba(139,92,246,0.18)",  title: "Masala Requests",  value: fmtN(stats.pendingMasala),    sub: "Pending review",                          link: "/manufacture-masala-admin-process",   delay: .16 },
          ].map(c => (
            <div className="col-xl-3 col-md-6" key={c.title}>
              <div className="card adm-stat mb-0" style={{ border: `1.5px solid ${c.border}`, background: c.bg, boxShadow: "none", animationDelay: `${c.delay}s` }}>
                <div className="card-body" style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: c.color, letterSpacing: .2 }}>{c.title}</div>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <i className={`bx ${c.icon}`} style={{ color: c.color, fontSize: 19 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", lineHeight: 1, marginBottom: 6 }}>{c.value}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>{c.sub}</div>
                  <Link to={c.link} className="adm-link" style={{ color: c.color }}>
                    View All <i className="bx bx-right-arrow-alt" style={{ fontSize: 15 }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </React.Fragment>
  );
};

export default AdminDashboard;
