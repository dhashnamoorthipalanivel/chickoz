import React, { useEffect, useState, useCallback } from "react";
import {
  getEnquiryReportApi, getLeadReportApi,
  getFranchiseReportApi, getMasalaReportApi,
} from "../../api/reportApi";

/* ─── CSS ───────────────────────────────────────────────────────── */
const CSS = `
  @keyframes rpt-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rpt-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .rpt-page     { animation:rpt-up .45s ease both; }
  .rpt-card     { background:#fff; border:1px solid #f0f0f0; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden; }
  .rpt-tab      { padding:10px 18px; font-size:13px; font-weight:700; border:none; background:none; cursor:pointer; border-bottom:3px solid transparent; color:#6b7280; transition:color .18s,border-color .18s; white-space:nowrap; }
  .rpt-tab.active { color:#D91E18; border-bottom-color:#D91E18; }
  .rpt-tab:hover:not(.active) { color:#F97316; }
  .rpt-inp      { border:1.5px solid #ede9e0; border-radius:9px; padding:8px 12px; font-size:13px; color:#1a1a1a; outline:none !important; transition:border-color .2s,box-shadow .2s; background:#fff; }
  .rpt-inp:focus,.rpt-inp:focus-visible { border-color:#F97316 !important; box-shadow:0 0 0 3.5px rgba(249,115,22,0.13) !important; outline:none !important; }
  .rpt-inp::placeholder { color:#b8b2a7; }
  .rpt-select   { appearance:none; -webkit-appearance:none; border:1.5px solid #ede9e0; border-radius:9px; padding:8px 32px 8px 12px; font-size:13px; color:#1a1a1a; outline:none !important; transition:border-color .2s; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 10px center; cursor:pointer; }
  .rpt-select:focus { border-color:#F97316 !important; box-shadow:0 0 0 3.5px rgba(249,115,22,0.13) !important; }
  .rpt-btn      { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; border:none; font-size:13px; font-weight:700; cursor:pointer; transition:opacity .18s,box-shadow .18s; }
  .rpt-btn-red  { background:linear-gradient(135deg,#D91E18,#F97316); color:#fff !important; box-shadow:0 3px 10px rgba(217,30,24,0.25); }
  .rpt-btn-red:hover  { opacity:.87; }
  .rpt-btn-red:disabled { opacity:.5; cursor:not-allowed; }
  .rpt-btn-out  { background:#fff; border:1.5px solid #ede9e0 !important; color:#374151; }
  .rpt-btn-out:hover  { border-color:#D91E18 !important; color:#D91E18; }
  .rpt-btn-grn  { background:linear-gradient(135deg,#059669,#10b981); color:#fff !important; box-shadow:0 3px 10px rgba(5,150,105,0.22); }
  .rpt-btn-grn:hover  { opacity:.87; }
  .rpt-tr       { transition:background .15s; }
  .rpt-tr:hover { background:#fafaf8 !important; }
  .rpt-skel     { border-radius:6px; background:linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%); background-size:400px 100%; animation:rpt-shimmer 1.4s infinite; }
  .rpt-spin     { width:18px; height:18px; border:2.5px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:rpt-up .7s linear infinite; display:inline-block; }
  @keyframes rpt-spin { to{transform:rotate(360deg)} }
  .rpt-spin { animation:rpt-spin .7s linear infinite; }
`;

/* ─── utils ──────────────────────────────────────────────────────── */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const cap     = (v) => (v || "").replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase());
const INR     = (n) => `₹${Number(n||0).toLocaleString("en-IN")}`;

const STATUS_CLR = {
  NEW:"#3b82f6", FOLLOW_UP:"#f59e0b", HOLD:"#6b7280", CANCELLED:"#ef4444",
  CONVERTED_TO_LEAD:"#10b981", IN_PROGRESS:"#F97316", COMPLETED:"#059669",
  RETURN:"#8b5cf6", ACTIVE:"#10b981", UNDER_MAINTENANCE:"#f59e0b",
  INACTIVE:"#ef4444", CLOSED:"#6b7280",
  REQUESTED:"#3b82f6", UNDER_REVIEW:"#f59e0b", APPROVED:"#10b981",
  PROCESSING:"#F97316", DISPATCHED:"#8b5cf6", DELIVERED:"#059669",
  REJECTED:"#ef4444",
};

const Pill = ({ v }) => {
  const c = STATUS_CLR[v] || "#6b7280";
  return <span style={{ padding:"2px 10px", borderRadius:20, fontSize:10.5, fontWeight:700, background:`${c}15`, color:c, border:`1px solid ${c}28`, whiteSpace:"nowrap" }}>{cap(v)}</span>;
};

const Th = ({ ch }) => <th style={{ padding:"9px 12px", fontSize:11, fontWeight:800, color:"#9ca3af", whiteSpace:"nowrap", letterSpacing:.3, textTransform:"uppercase", background:"#fafaf8", borderBottom:"1px solid #f0f0f0" }}>{ch}</th>;
const Td = ({ ch, bold, muted, red, nowrap }) => <td style={{ padding:"9px 12px", fontWeight:bold?700:500, color:red?"#D91E18":muted?"#9ca3af":"#374151", whiteSpace:nowrap?"nowrap":undefined, fontSize:13 }}>{ch ?? "—"}</td>;

/* CSV export */
const exportCSV = (rows, cols, filename) => {
  const header = cols.map(c => c.label).join(",");
  const body   = rows.map(r => cols.map(c => `"${(c.get(r) ?? "").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob   = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/* Skeleton rows */
const SkelRows = ({ cols, n=6 }) => Array.from({ length:n }).map((_,i) => (
  <tr key={i}>
    {Array.from({ length:cols }).map((_,j) => (
      <td key={j} style={{ padding:"10px 12px" }}><div className="rpt-skel" style={{ height:12, borderRadius:5, width:`${55+Math.random()*35}%` }} /></td>
    ))}
  </tr>
));

/* ── Filter bar ──────────────────────────────────────────────────── */
const FilterBar = ({ from, to, setFrom, setTo, status, setStatus, statuses, search, setSearch, onApply, onClear, loading, extraSlot }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:10, padding:"14px 20px", borderBottom:"1px solid #f5f5f5", alignItems:"flex-end" }}>
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4, letterSpacing:.3 }}>FROM</div>
      <input type="date" className="rpt-inp" value={from} onChange={e=>setFrom(e.target.value)} />
    </div>
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4, letterSpacing:.3 }}>TO</div>
      <input type="date" className="rpt-inp" value={to} onChange={e=>setTo(e.target.value)} />
    </div>
    {statuses && (
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4, letterSpacing:.3 }}>STATUS</div>
        <select className="rpt-select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{cap(s)}</option>)}
        </select>
      </div>
    )}
    {extraSlot}
    <div style={{ flex:1, minWidth:180 }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4, letterSpacing:.3 }}>SEARCH</div>
      <div style={{ position:"relative" }}>
        <i className="bx bx-search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:15 }} />
        <input className="rpt-inp" style={{ paddingLeft:30, width:"100%" }} placeholder="Name / Phone / ID…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onApply()} />
      </div>
    </div>
    <button className="rpt-btn rpt-btn-red" onClick={onApply} disabled={loading}>
      {loading ? <span className="rpt-spin" /> : <i className="bx bx-filter-alt" />}
      {loading ? "Loading…" : "Apply"}
    </button>
    <button className="rpt-btn rpt-btn-out" onClick={onClear}>
      <i className="bx bx-x" /> Clear
    </button>
  </div>
);

/* ── Result toolbar ──────────────────────────────────────────────── */
const Toolbar = ({ count, onExport, label }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderBottom:"1px solid #f5f5f5", background:"#fafaf8" }}>
    <span style={{ fontSize:12.5, color:"#6b7280", fontWeight:600 }}>
      <strong style={{ color:"#1a1a1a" }}>{count}</strong> {label} found
    </span>
    <button className="rpt-btn rpt-btn-grn" onClick={onExport} disabled={count===0}>
      <i className="bx bx-download" /> Export CSV
    </button>
  </div>
);

/* ════════════════════════════════════════════════════════════════ */
const TABS = [
  { key:"enquiry",  label:"Enquiry Report",   icon:"bx-message-square-dots" },
  { key:"lead",     label:"Lead Report",       icon:"bx-user-pin"            },
  { key:"franchise",label:"Franchise Report",  icon:"bx-store-alt"           },
  { key:"masala",   label:"Masala Supply",     icon:"bx-package"             },
];

const AdminReport = () => {
  const [tab, setTab]   = useState("enquiry");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to,   setTo]   = useState("");
  const [status, setStatus]   = useState("");
  const [search, setSearch]   = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const el = document.createElement("style"); el.id = "rpt-adm-css"; el.textContent = CSS;
    document.head.appendChild(el); return () => el.remove();
  }, []);

  const reset = () => { setFrom(""); setTo(""); setStatus(""); setSearch(""); setRows([]); setSummary(null); };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = { from, to, status, search };
      let res;
      if (tab==="enquiry")   res = await getEnquiryReportApi(p);
      if (tab==="lead")      res = await getLeadReportApi(p);
      if (tab==="franchise") res = await getFranchiseReportApi({ status, search });
      if (tab==="masala")    res = await getMasalaReportApi(p);
      setRows(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch(_) { setRows([]); }
    finally { setLoading(false); }
  }, [tab, from, to, status, search]);

  useEffect(() => { reset(); }, [tab]);

  /* ── CSV column definitions ── */
  const csvCols = {
    enquiry: [
      { label:"Ref ID",       get: r => r.referenceId },
      { label:"Name",         get: r => r.name },
      { label:"Phone",        get: r => r.phone },
      { label:"Place",        get: r => r.place },
      { label:"Status",       get: r => r.status },
      { label:"Package",      get: r => r.interestedPackage?.packageName || "" },
      { label:"Lead Source",  get: r => r.leadSource?.sourceName || "" },
      { label:"Date",         get: r => fmtDate(r.createdAt) },
    ],
    lead: [
      { label:"Ref ID",       get: r => r.referenceId },
      { label:"Name",         get: r => r.name },
      { label:"Phone",        get: r => r.phone },
      { label:"Place",        get: r => r.place },
      { label:"Status",       get: r => r.leadStatus },
      { label:"Package",      get: r => r.interestedPackage?.packageName || "" },
      { label:"Lead Source",  get: r => r.leadSource?.sourceName || "" },
      { label:"Date",         get: r => fmtDate(r.createdAt) },
    ],
    franchise: [
      { label:"Franchise ID",  get: r => r.franchiseId },
      { label:"Name",          get: r => r.franchiseName },
      { label:"Owner",         get: r => r.ownerName },
      { label:"Location",      get: r => r.location || "" },
      { label:"Contact",       get: r => r.contact },
      { label:"Email",         get: r => r.email },
      { label:"Status",        get: r => r.status },
      { label:"Package",       get: r => r.packageName || "" },
      { label:"Date Joined",   get: r => fmtDate(r.createdAt) },
    ],
    masala: [
      { label:"Request ID",    get: r => r.requestId },
      { label:"Franchise",     get: r => r.franchise?.franchiseName || "" },
      { label:"Items",         get: r => r.totalItems || 0 },
      { label:"Total Amount",  get: r => r.totalAmount || 0 },
      { label:"Status",        get: r => r.status },
      { label:"Priority",      get: r => r.priority || "" },
      { label:"Date",          get: r => fmtDate(r.createdAt) },
    ],
  };

  return (
    <div className="rpt-page">

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#D91E18,#F97316)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(217,30,24,0.28)" }}>
            <i className="bx bx-file-find" style={{ color:"#fff", fontSize:21 }} />
          </div>
          <div>
            <h4 style={{ margin:0, fontWeight:800, fontSize:19, color:"#1a1a1a" }}>Admin Reports</h4>
            <p style={{ margin:0, fontSize:12.5, color:"#9ca3af" }}>CRM & operational data across all franchises</p>
          </div>
        </div>
      </div>

      {/* Tabs + content card */}
      <div className="rpt-card">

        {/* Tab bar */}
        <div style={{ display:"flex", borderBottom:"1px solid #f0f0f0", overflowX:"auto", background:"#fff" }}>
          {TABS.map(t => (
            <button key={t.key} className={`rpt-tab ${tab===t.key?"active":""}`} onClick={() => setTab(t.key)}>
              <i className={`bx ${t.icon}`} style={{ marginRight:6, fontSize:14 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <FilterBar
          from={from} to={to} setFrom={setFrom} setTo={setTo}
          status={status} setStatus={setStatus}
          statuses={
            tab==="enquiry"   ? ["NEW","FOLLOW_UP","HOLD","CANCELLED","CONVERTED_TO_LEAD"] :
            tab==="lead"      ? ["NEW","IN_PROGRESS","HOLD","CANCELLED","RETURN","COMPLETED"] :
            tab==="franchise" ? ["ACTIVE","UNDER_MAINTENANCE","INACTIVE","CLOSED"] :
            ["REQUESTED","UNDER_REVIEW","APPROVED","PROCESSING","DISPATCHED","DELIVERED","REJECTED","CANCELLED"]
          }
          search={search} setSearch={setSearch}
          onApply={fetch} onClear={reset} loading={loading}
        />

        {/* Toolbar */}
        {rows.length > 0 && (
          <Toolbar
            count={rows.length}
            label={tab==="enquiry"?"enquiries":tab==="lead"?"leads":tab==="franchise"?"franchises":"requests"}
            onExport={() => exportCSV(rows, csvCols[tab], `${tab}-report-${Date.now()}.csv`)}
          />
        )}

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr>
                {tab==="enquiry" && (<><Th ch="#"/><Th ch="Ref ID"/><Th ch="Name"/><Th ch="Phone"/><Th ch="Place"/><Th ch="Package"/><Th ch="Source"/><Th ch="Status"/><Th ch="Date"/></>)}
                {tab==="lead"    && (<><Th ch="#"/><Th ch="Ref ID"/><Th ch="Name"/><Th ch="Phone"/><Th ch="Place"/><Th ch="Package"/><Th ch="Source"/><Th ch="Status"/><Th ch="Date"/></>)}
                {tab==="franchise" && (<><Th ch="#"/><Th ch="Franchise ID"/><Th ch="Name"/><Th ch="Owner"/><Th ch="Location"/><Th ch="Contact"/><Th ch="Status"/><Th ch="Package"/><Th ch="Date"/></>)}
                {tab==="masala" && (<><Th ch="#"/><Th ch="Request ID"/><Th ch="Franchise"/><Th ch="Items"/><Th ch="Total Amount"/><Th ch="Priority"/><Th ch="Status"/><Th ch="Date"/></>)}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkelRows cols={tab==="franchise"?9:9} n={6} /> :
               rows.length===0 ? (
                <tr><td colSpan={9} style={{ textAlign:"center", padding:"52px 20px", color:"#c4cdd6" }}>
                  <i className="bx bx-file display-5 d-block mb-2" style={{ fontSize:40 }} />
                  <div style={{ fontSize:14 }}>No records yet. Apply filters and click <strong>Apply</strong>.</div>
                </td></tr>
               ) : rows.map((r, i) => (
                <tr key={r._id} className="rpt-tr" style={{ borderBottom:"1px solid #f5f5f5" }}>
                  <Td ch={i+1} muted />
                  {tab==="enquiry" && (<>
                    <Td ch={r.referenceId} red nowrap />
                    <Td ch={r.name} bold />
                    <Td ch={r.phone} muted />
                    <Td ch={r.place} muted />
                    <Td ch={r.interestedPackage?.packageName} muted />
                    <Td ch={r.leadSource?.sourceName} muted />
                    <td style={{ padding:"9px 12px" }}><Pill v={r.status} /></td>
                    <Td ch={fmtDate(r.createdAt)} muted nowrap />
                  </>)}
                  {tab==="lead" && (<>
                    <Td ch={r.referenceId} red nowrap />
                    <Td ch={r.name} bold />
                    <Td ch={r.phone} muted />
                    <Td ch={r.place} muted />
                    <Td ch={r.interestedPackage?.packageName} muted />
                    <Td ch={r.leadSource?.sourceName} muted />
                    <td style={{ padding:"9px 12px" }}><Pill v={r.leadStatus} /></td>
                    <Td ch={fmtDate(r.createdAt)} muted nowrap />
                  </>)}
                  {tab==="franchise" && (<>
                    <Td ch={r.franchiseId} red nowrap />
                    <Td ch={r.franchiseName} bold />
                    <Td ch={r.ownerName} />
                    <Td ch={r.location} muted />
                    <Td ch={r.contact} muted />
                    <td style={{ padding:"9px 12px" }}><Pill v={r.status} /></td>
                    <Td ch={r.packageName} muted />
                    <Td ch={fmtDate(r.createdAt)} muted nowrap />
                  </>)}
                  {tab==="masala" && (<>
                    <Td ch={r.requestId} red nowrap />
                    <Td ch={r.franchise?.franchiseName} bold />
                    <Td ch={`${r.totalItems||0} items`} muted />
                    <td style={{ padding:"9px 12px", fontWeight:800, color:"#059669" }}>{INR(r.totalAmount)}</td>
                    <td style={{ padding:"9px 12px" }}>
                      <span style={{ fontSize:10.5, fontWeight:700, padding:"2px 9px", borderRadius:20, background:r.priority==="Urgent"?"rgba(217,30,24,0.1)":"#f3f4f6", color:r.priority==="Urgent"?"#D91E18":"#6b7280" }}>
                        {r.priority==="Urgent"?"⚡ Urgent":"Normal"}
                      </span>
                    </td>
                    <td style={{ padding:"9px 12px" }}><Pill v={r.status} /></td>
                    <Td ch={fmtDate(r.createdAt)} muted nowrap />
                  </>)}
                </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        {summary && (
          <div style={{ display:"flex", gap:24, padding:"12px 20px", borderTop:"1px solid #f5f5f5", background:"#fafaf8", flexWrap:"wrap" }}>
            {Object.entries(summary).map(([k,v]) => (
              <div key={k} style={{ fontSize:12.5 }}>
                <span style={{ color:"#9ca3af", fontWeight:600 }}>{cap(k)}: </span>
                <strong style={{ color:"#1a1a1a" }}>{typeof v==="number"&&k.toLowerCase().includes("revenue") ? INR(v) : Number.isInteger(v) ? v : v.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminReport;
