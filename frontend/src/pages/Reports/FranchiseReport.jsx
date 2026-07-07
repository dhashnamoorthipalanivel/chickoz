import React, { useEffect, useState, useCallback } from "react";
import {
  getOrderReportApi, getSalesReportApi,
  getFranchiseMasalaApi, getItemReportApi,
  getReportFranchisesApi,
} from "../../api/reportApi";

/* ─── CSS ───────────────────────────────────────────────────────── */
const CSS = `
  @keyframes frr-up  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes frr-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes frr-spin { to{transform:rotate(360deg)} }

  .frr-page   { animation:frr-up .45s ease both; }
  .frr-card   { background:#fff; border:1px solid #f0f0f0; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden; }
  .frr-tab    { padding:10px 18px; font-size:13px; font-weight:700; border:none; background:none; cursor:pointer; border-bottom:3px solid transparent; color:#6b7280; transition:color .18s,border-color .18s; white-space:nowrap; }
  .frr-tab.active { color:#D91E18; border-bottom-color:#D91E18; }
  .frr-tab:hover:not(.active) { color:#F97316; }
  .frr-inp    { border:1.5px solid #ede9e0; border-radius:9px; padding:8px 12px; font-size:13px; color:#1a1a1a; outline:none !important; transition:border-color .2s,box-shadow .2s; background:#fff; }
  .frr-inp:focus,.frr-inp:focus-visible { border-color:#F97316 !important; box-shadow:0 0 0 3.5px rgba(249,115,22,0.13) !important; outline:none !important; }
  .frr-inp::placeholder { color:#b8b2a7; }
  .frr-select { appearance:none; -webkit-appearance:none; border:1.5px solid #ede9e0; border-radius:9px; padding:8px 32px 8px 12px; font-size:13px; color:#1a1a1a; outline:none !important; transition:border-color .2s; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 10px center; cursor:pointer; }
  .frr-select:focus { border-color:#F97316 !important; box-shadow:0 0 0 3.5px rgba(249,115,22,0.13) !important; }
  .frr-btn    { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; border:none; font-size:13px; font-weight:700; cursor:pointer; transition:opacity .18s,box-shadow .18s; }
  .frr-btn-red{ background:linear-gradient(135deg,#D91E18,#F97316); color:#fff !important; box-shadow:0 3px 10px rgba(217,30,24,0.25); }
  .frr-btn-red:hover { opacity:.87; } .frr-btn-red:disabled { opacity:.5; cursor:not-allowed; }
  .frr-btn-out{ background:#fff; border:1.5px solid #ede9e0 !important; color:#374151; }
  .frr-btn-out:hover { border-color:#D91E18 !important; color:#D91E18; }
  .frr-btn-grn{ background:linear-gradient(135deg,#059669,#10b981); color:#fff !important; box-shadow:0 3px 10px rgba(5,150,105,0.22); }
  .frr-btn-grn:hover { opacity:.87; }
  .frr-tr     { transition:background .15s; }
  .frr-tr:hover { background:#fafaf8 !important; }
  .frr-skel   { border-radius:6px; background:linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%); background-size:400px 100%; animation:frr-shimmer 1.4s infinite; }
  .frr-spin   { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:frr-spin .7s linear infinite; display:inline-block; }
  .frr-spin-dark { width:16px; height:16px; border:2.5px solid #ede9e0; border-top-color:#D91E18; border-radius:50%; animation:frr-spin .7s linear infinite; display:inline-block; }

  /* Franchise selector bar */
  .frr-sel-bar  { background:#fff; border:1px solid #f0f0f0; border-radius:16px; padding:18px 22px; box-shadow:0 2px 12px rgba(0,0,0,0.05); margin-bottom:20px; animation:frr-up .4s ease both; }
  .frr-sel-wrap { position:relative; display:flex; align-items:center; }
  .frr-sel-ico  { position:absolute; left:12px; color:#D91E18; font-size:17px; pointer-events:none; z-index:2; }
  .frr-sel-arr  { position:absolute; right:12px; color:#9ca3af; font-size:16px; pointer-events:none; }
  .frr-sel-dd   { appearance:none; -webkit-appearance:none; width:100%; min-width:240px; padding:11px 36px 11px 36px; border:1.5px solid #ede9e0; border-radius:11px; font-size:13.5px; font-weight:600; color:#1a1a1a; background:#fff; cursor:pointer; transition:border-color .2s,box-shadow .2s; outline:none !important; }
  .frr-sel-dd:focus,.frr-sel-dd:focus-visible { border-color:#F97316 !important; box-shadow:0 0 0 3.5px rgba(249,115,22,0.14) !important; outline:none !important; }
  .frr-banner   { background:linear-gradient(135deg,rgba(217,30,24,.05),rgba(249,115,22,.05)); border:1.5px solid rgba(217,30,24,.12); border-radius:12px; padding:12px 18px; display:flex; align-items:center; gap:12px; margin-top:14px; animation:frr-up .3s ease both; flex-wrap:wrap; }
  .frr-banner-clear { margin-left:auto; background:none; border:none; cursor:pointer; color:#9ca3af; font-size:18px; display:flex; align-items:center; transition:color .18s; }
  .frr-banner-clear:hover { color:#D91E18; }

  /* Stat cards */
  .frr-stat     { background:#fff; border:1px solid #f0f0f0; border-radius:14px; padding:18px 20px; animation:frr-up .4s ease both; transition:transform .2s,box-shadow .2s; }
  .frr-stat:hover { transform:translateY(-3px); box-shadow:0 8px 22px rgba(0,0,0,0.08); }

  /* Fcard grid */
  .frr-fcard    { border:1.5px solid #ede9e0; border-radius:14px; padding:16px; background:#fff; cursor:pointer; transition:border-color .2s,box-shadow .2s,transform .2s; width:100%; text-align:left; }
  .frr-fcard:hover { border-color:#D91E18; box-shadow:0 6px 18px rgba(217,30,24,0.1); transform:translateY(-2px); }
`;

/* ─── utils ──────────────────────────────────────────────────────── */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const cap     = (v) => (v||"").replace(/_/g," ").replace(/\b\w/g, c=>c.toUpperCase());
const INR     = (n) => `₹${Number(n||0).toLocaleString("en-IN")}`;

const STATUS_CLR = {
  PENDING:"#6b7280", PREPARING:"#f59e0b", COMPLETED:"#10b981", CANCELLED:"#ef4444",
  CASH:"#10b981", CARD:"#3b82f6", UPI:"#8b5cf6", WALLET:"#f59e0b", OTHER:"#6b7280",
  DINE_IN:"#3b82f6", TAKE_AWAY:"#F97316", HOME_DELIVERY:"#8b5cf6",
  REQUESTED:"#3b82f6", UNDER_REVIEW:"#f59e0b", APPROVED:"#10b981",
  PROCESSING:"#F97316", DISPATCHED:"#8b5cf6", DELIVERED:"#059669", REJECTED:"#ef4444",
  ACTIVE:"#10b981", UNDER_MAINTENANCE:"#f59e0b", INACTIVE:"#ef4444", CLOSED:"#6b7280",
};

const Pill = ({ v }) => {
  const c = STATUS_CLR[v] || "#6b7280";
  return <span style={{ padding:"2px 10px", borderRadius:20, fontSize:10.5, fontWeight:700, background:`${c}15`, color:c, border:`1px solid ${c}28`, whiteSpace:"nowrap" }}>{cap(v)}</span>;
};

const Th = ({ ch }) => <th style={{ padding:"9px 12px", fontSize:11, fontWeight:800, color:"#9ca3af", whiteSpace:"nowrap", letterSpacing:.3, textTransform:"uppercase", background:"#fafaf8", borderBottom:"1px solid #f0f0f0" }}>{ch}</th>;
const Td = ({ ch, bold, muted, green, red, nowrap }) => <td style={{ padding:"9px 12px", fontWeight:bold?700:500, color:green?"#059669":red?"#D91E18":muted?"#9ca3af":"#374151", whiteSpace:nowrap?"nowrap":undefined, fontSize:13 }}>{ch??<span style={{color:"#d1d5db"}}>—</span>}</td>;

const exportCSV = (rows, cols, filename) => {
  const header = cols.map(c=>c.label).join(",");
  const body   = rows.map(r=>cols.map(c=>`"${(c.get(r)??"")}"`).join(",")).join("\n");
  const blob   = new Blob([header+"\n"+body], { type:"text/csv;charset=utf-8;" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
};

const SkelRows = ({ cols, n=6 }) => Array.from({ length:n }).map((_,i) => (
  <tr key={i}>{Array.from({ length:cols }).map((_,j) => (
    <td key={j} style={{ padding:"10px 12px" }}><div className="frr-skel" style={{ height:12, width:`${55+Math.random()*35}%` }} /></td>
  ))}</tr>
));

const SumCard = ({ icon, grad, label:lbl, value, sub, delay=0 }) => (
  <div className="frr-stat" style={{ animationDelay:`${delay}s` }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
      <div style={{ fontSize:11.5, fontWeight:700, color:"#9ca3af" }}>{lbl}</div>
      <div style={{ width:38, height:38, borderRadius:11, background:grad, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <i className={`bx ${icon}`} style={{ color:"#fff", fontSize:18 }} />
      </div>
    </div>
    <div style={{ fontSize:22, fontWeight:800, color:"#1a1a1a", lineHeight:1, marginBottom:4 }}>{value}</div>
    {sub && <div style={{ fontSize:11.5, color:"#9ca3af" }}>{sub}</div>}
  </div>
);

/* ─── FilterBar ──────────────────────────────────────────────────── */
const FilterBar = ({ from, to, setFrom, setTo, status, setStatus, statuses, search, setSearch, onApply, onClear, loading, extraSlot }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:10, padding:"14px 20px", borderBottom:"1px solid #f5f5f5", alignItems:"flex-end" }}>
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4 }}>FROM</div>
      <input type="date" className="frr-inp" value={from} onChange={e=>setFrom(e.target.value)} />
    </div>
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4 }}>TO</div>
      <input type="date" className="frr-inp" value={to} onChange={e=>setTo(e.target.value)} />
    </div>
    {statuses && (
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4 }}>STATUS</div>
        <select className="frr-select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All</option>
          {statuses.map(s=><option key={s} value={s}>{cap(s)}</option>)}
        </select>
      </div>
    )}
    {extraSlot}
    {setSearch !== null && (
      <div style={{ flex:1, minWidth:160 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4 }}>SEARCH</div>
        <div style={{ position:"relative" }}>
          <i className="bx bx-search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:14 }} />
          <input className="frr-inp" style={{ paddingLeft:28, width:"100%" }} placeholder="Order / Customer…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onApply()} />
        </div>
      </div>
    )}
    <button className="frr-btn frr-btn-red" onClick={onApply} disabled={loading}>
      {loading ? <span className="frr-spin" /> : <i className="bx bx-filter-alt" />}
      {loading?"Loading…":"Apply"}
    </button>
    <button className="frr-btn frr-btn-out" onClick={onClear}><i className="bx bx-x" /> Clear</button>
  </div>
);

const Toolbar = ({ count, label, onExport }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderBottom:"1px solid #f5f5f5", background:"#fafaf8" }}>
    <span style={{ fontSize:12.5, color:"#6b7280", fontWeight:600 }}>
      <strong style={{ color:"#1a1a1a" }}>{count}</strong> {label} found
    </span>
    <button className="frr-btn frr-btn-grn" onClick={onExport} disabled={count===0}>
      <i className="bx bx-download" /> Export CSV
    </button>
  </div>
);

/* ════════════════════════════════════════════════════════════════ */
const TABS = [
  { key:"orders",  label:"Orders",         icon:"bx-receipt" },
  { key:"sales",   label:"Sales Summary",  icon:"bx-line-chart" },
  { key:"masala",  label:"Masala Requests",icon:"bx-package" },
  { key:"items",   label:"Top Items",      icon:"bx-food-menu" },
];

const FranchiseReport = () => {
  const user    = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = ["admin","super_admin"].includes(user.role);

  const [tab,    setTab]    = useState("orders");
  const [rows,   setRows]   = useState([]);
  const [loading,setLoading]= useState(false);
  const [from,   setFrom]   = useState("");
  const [to,     setTo]     = useState("");
  const [status, setStatus] = useState("");
  const [orderType, setOrderType]   = useState("");
  const [payMode,   setPayMode]     = useState("");
  const [search,    setSearch]      = useState("");
  const [summary,   setSummary]     = useState(null);
  const [franchises,setFranchises]  = useState([]);
  const [selFid,    setSelFid]      = useState("");
  const [noSel,     setNoSel]       = useState(isAdmin);

  useEffect(() => {
    const el = document.createElement("style"); el.id="frr-css"; el.textContent=CSS;
    document.head.appendChild(el); return () => el.remove();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    getReportFranchisesApi().then(r=>setFranchises(r.data)).catch(()=>{});
  }, [isAdmin]);

  const selFran = franchises.find(f=>f._id===selFid);
  const statusClr = { ACTIVE:"#10b981", UNDER_MAINTENANCE:"#f59e0b", INACTIVE:"#D91E18", CLOSED:"#6b7280" };

  const reset = () => { setFrom(""); setTo(""); setStatus(""); setOrderType(""); setPayMode(""); setSearch(""); setRows([]); setSummary(null); };

  const doFetch = useCallback(async () => {
    if (isAdmin && !selFid) return;
    setLoading(true);
    try {
      const p = { from, to, status, search };
      if (isAdmin && selFid) p.franchiseId = selFid;
      let res;
      if (tab==="orders")  { const q={...p,orderType,paymentMethod:payMode,orderStatus:status}; res = await getOrderReportApi(q); }
      if (tab==="sales")   res = await getSalesReportApi(p);
      if (tab==="masala")  res = await getFranchiseMasalaApi(p);
      if (tab==="items")   res = await getItemReportApi(p);
      setRows(res.data.data  || []);
      setSummary(res.data.summary || null);
    } catch(_) { setRows([]); }
    finally { setLoading(false); }
  }, [tab, from, to, status, orderType, payMode, search, selFid, isAdmin]);

  useEffect(() => { reset(); }, [tab]);

  /* CSV cols */
  const csvCols = {
    orders: [
      { label:"Order No",      get:r=>r.orderNumber },
      { label:"Customer",      get:r=>r.customerName },
      { label:"Mobile",        get:r=>r.customerMobile },
      { label:"Type",          get:r=>r.orderType },
      { label:"Items",         get:r=>(r.items||[]).length },
      { label:"Subtotal",      get:r=>r.subtotal||0 },
      { label:"Discount",      get:r=>r.discount||0 },
      { label:"Tax",           get:r=>r.tax||0 },
      { label:"Total",         get:r=>r.totalAmount||0 },
      { label:"Payment",       get:r=>r.paymentMethod },
      { label:"Status",        get:r=>r.orderStatus },
      { label:"Date",          get:r=>fmtDate(r.createdAt) },
    ],
    sales: [
      { label:"Date",          get:r=>r.date },
      { label:"Orders",        get:r=>r.orders },
      { label:"Revenue",       get:r=>r.revenue },
      { label:"Tax",           get:r=>r.tax },
      { label:"Discount",      get:r=>r.discount },
    ],
    masala: [
      { label:"Request ID",    get:r=>r.requestId },
      { label:"Franchise",     get:r=>r.franchise?.franchiseName||"" },
      { label:"Items",         get:r=>r.totalItems||0 },
      { label:"Total Amount",  get:r=>r.totalAmount||0 },
      { label:"Status",        get:r=>r.status },
      { label:"Date",          get:r=>fmtDate(r.createdAt) },
    ],
    items: [
      { label:"Item Name",     get:r=>r.menuName },
      { label:"Qty Sold",      get:r=>r.qty },
      { label:"Revenue",       get:r=>r.revenue },
    ],
  };

  /* ── Franchise selector for admin ── */
  const SelBar = () => !isAdmin ? null : (
    <div className="frr-sel-bar">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#D91E18,#F97316)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(217,30,24,0.25)", flexShrink:0 }}>
            <i className="bx bx-file-find" style={{ color:"#fff", fontSize:20 }} />
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:"#1a1a1a" }}>Franchise Report</div>
            <div style={{ fontSize:12.5, color:"#9ca3af" }}>
              {selFran ? `Viewing: ${selFran.franchiseName||selFran.franchiseId}` : "Select a franchise to view its reports"}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div className="frr-sel-wrap">
            <i className="bx bx-store frr-sel-ico" />
            <select className="frr-sel-dd" value={selFid} onChange={e=>{ setSelFid(e.target.value); setNoSel(!e.target.value); reset(); }}>
              <option value="">— Select Franchise —</option>
              {franchises.map(f=><option key={f._id} value={f._id}>{f.franchiseName||f.franchiseId}{f.location?` · ${f.location}`:""}</option>)}
            </select>
            <i className="bx bx-chevron-down frr-sel-arr" />
          </div>
        </div>
      </div>

      {selFran && (
        <div className="frr-banner">
          <div style={{ width:10, height:10, borderRadius:"50%", background:"linear-gradient(135deg,#D91E18,#F97316)", flexShrink:0, boxShadow:"0 0 0 3px rgba(217,30,24,0.15)" }} />
          <div>
            <div style={{ fontWeight:700, fontSize:13.5, color:"#1a1a1a" }}>{selFran.franchiseName||selFran.franchiseId}</div>
            {selFran.location && <div style={{ fontSize:12, color:"#9ca3af" }}><i className="bx bx-map-pin" style={{ fontSize:11 }} /> {selFran.location}</div>}
          </div>
          {selFran.status && (
            <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10.5, fontWeight:700, background:`${statusClr[selFran.status]||"#6b7280"}15`, color:statusClr[selFran.status]||"#6b7280", border:`1px solid ${statusClr[selFran.status]||"#6b7280"}28` }}>
              {cap(selFran.status)}
            </span>
          )}
          <button className="frr-banner-clear" onClick={()=>{ setSelFid(""); setNoSel(true); reset(); }}><i className="bx bx-x" /></button>
        </div>
      )}
    </div>
  );

  /* ── No franchise selected (admin) ── */
  if (isAdmin && noSel) return (
    <div className="frr-page">
      <SelBar />
      <div style={{ textAlign:"center", padding:"28px 0 20px" }}>
        <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(135deg,#D91E18,#F97316)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 22px rgba(217,30,24,0.25)", margin:"0 auto 14px" }}>
          <i className="bx bx-file-find" style={{ color:"#fff", fontSize:28 }} />
        </div>
        <h5 style={{ fontWeight:800, color:"#1a1a1a", marginBottom:6 }}>Choose a Franchise to View Reports</h5>
        <p style={{ fontSize:13.5, color:"#9ca3af", margin:0 }}>Pick from the dropdown above or click a card below</p>
      </div>
      {franchises.length > 0 ? (
        <div className="row g-3">
          {franchises.map((f,i) => {
            const clr = statusClr[f.status]||"#6b7280";
            return (
              <div className="col-xl-3 col-md-4 col-sm-6" key={f._id} style={{ animationDelay:`${i*0.04}s` }}>
                <button className="frr-fcard" onClick={()=>{ setSelFid(f._id); setNoSel(false); }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#D91E18,#F97316)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <i className="bx bx-store-alt" style={{ color:"#fff", fontSize:17 }} />
                    </div>
                    <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10.5, fontWeight:700, background:`${clr}15`, color:clr, border:`1px solid ${clr}28` }}>
                      {(f.status||"").replace(/_/g," ")}
                    </span>
                  </div>
                  <div style={{ fontSize:13.5, fontWeight:700, color:"#1a1a1a", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.franchiseName||f.franchiseId}</div>
                  {f.location && <div style={{ fontSize:12, color:"#9ca3af", display:"flex", alignItems:"center", gap:4 }}><i className="bx bx-map-pin" style={{ fontSize:12 }} />{f.location}</div>}
                  {f.ownerName && <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #f5f5f5", fontSize:12, color:"#9ca3af" }}><i className="bx bx-user" style={{ fontSize:12, marginRight:4 }} />{f.ownerName}</div>}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign:"center", color:"#c4cdd6", padding:"40px 0" }}>
          <i className="bx bx-store" style={{ fontSize:40, display:"block", marginBottom:8 }} /><p style={{ fontSize:14 }}>No franchises found</p>
        </div>
      )}
    </div>
  );

  /* ── Summary cards (orders & sales tabs) ── */
  const SummaryCards = () => {
    if (!summary) return null;
    if (tab==="orders") return (
      <div className="row g-3 mb-3">
        {[
          { icon:"bx-receipt",       grad:"linear-gradient(135deg,#3b82f6,#60a5fa)", label:"Total Orders",   value:summary.totalOrders, sub:"in this period" },
          { icon:"bx-rupee",         grad:"linear-gradient(135deg,#D91E18,#F97316)", label:"Total Revenue",  value:INR(summary.totalRevenue), sub:"net revenue" },
          { icon:"bx-discount",      grad:"linear-gradient(135deg,#10b981,#34d399)", label:"Total Discount", value:INR(summary.totalDiscount), sub:"total discounts" },
          { icon:"bx-purchase-tag",  grad:"linear-gradient(135deg,#8b5cf6,#a78bfa)", label:"Total Tax",      value:INR(summary.totalTax), sub:"tax collected" },
        ].map((c,i)=><div className="col-xl-3 col-md-6" key={c.label}><SumCard {...c} delay={i*0.05} /></div>)}
      </div>
    );
    if (tab==="sales") return (
      <div className="row g-3 mb-3">
        {[
          { icon:"bx-calendar",    grad:"linear-gradient(135deg,#3b82f6,#60a5fa)",  label:"Days in Period",  value:summary.totalDays },
          { icon:"bx-receipt",     grad:"linear-gradient(135deg,#F97316,#fbbf24)",  label:"Total Orders",    value:summary.totalOrders },
          { icon:"bx-rupee",       grad:"linear-gradient(135deg,#D91E18,#F97316)",  label:"Total Revenue",   value:INR(summary.totalRevenue) },
          { icon:"bx-bar-chart",   grad:"linear-gradient(135deg,#10b981,#34d399)",  label:"Avg / Day",       value:INR(Math.round(summary.avgPerDay)) },
        ].map((c,i)=><div className="col-xl-3 col-md-6" key={c.label}><SumCard {...c} delay={i*0.05} /></div>)}
      </div>
    );
    return null;
  };

  return (
    <div className="frr-page">
      <SelBar />
      <SummaryCards />

      <div className="frr-card">
        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #f0f0f0", overflowX:"auto", background:"#fff" }}>
          {TABS.map(t=>(
            <button key={t.key} className={`frr-tab ${tab===t.key?"active":""}`} onClick={()=>setTab(t.key)}>
              <i className={`bx ${t.icon}`} style={{ marginRight:6, fontSize:14 }} />{t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <FilterBar
          from={from} to={to} setFrom={setFrom} setTo={setTo}
          status={tab==="masala"?status:tab==="orders"?status:undefined}
          setStatus={setStatus}
          statuses={
            tab==="orders" ? ["PENDING","PREPARING","COMPLETED","CANCELLED"] :
            tab==="masala" ? ["REQUESTED","UNDER_REVIEW","APPROVED","PROCESSING","DISPATCHED","DELIVERED","REJECTED","CANCELLED"] :
            undefined
          }
          search={tab==="orders"?search:null} setSearch={tab==="orders"?setSearch:null}
          onApply={doFetch} onClear={reset} loading={loading}
          extraSlot={tab==="orders" ? (
            <>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4 }}>ORDER TYPE</div>
                <select className="frr-select" value={orderType} onChange={e=>setOrderType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="DINE_IN">Dine In</option>
                  <option value="TAKE_AWAY">Take Away</option>
                  <option value="HOME_DELIVERY">Home Delivery</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:4 }}>PAYMENT</div>
                <select className="frr-select" value={payMode} onChange={e=>setPayMode(e.target.value)}>
                  <option value="">All</option>
                  {["CASH","CARD","UPI","WALLET","OTHER"].map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </>
          ) : null}
        />

        {/* Toolbar */}
        {rows.length>0 && (
          <Toolbar
            count={rows.length}
            label={tab==="orders"?"orders":tab==="sales"?"days":tab==="masala"?"requests":"items"}
            onExport={()=>exportCSV(rows, csvCols[tab], `franchise-${tab}-report-${Date.now()}.csv`)}
          />
        )}

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead><tr>
              {tab==="orders" && (<><Th ch="#"/><Th ch="Order No"/><Th ch="Customer"/><Th ch="Mobile"/><Th ch="Type"/><Th ch="Items"/><Th ch="Subtotal"/><Th ch="Discount"/><Th ch="Tax"/><Th ch="Total"/><Th ch="Payment"/><Th ch="Status"/><Th ch="Date"/></>)}
              {tab==="sales"  && (<><Th ch="Date"/><Th ch="Orders"/><Th ch="Revenue"/><Th ch="Tax"/><Th ch="Discount"/></>)}
              {tab==="masala" && (<><Th ch="#"/><Th ch="Request ID"/><Th ch="Items"/><Th ch="Total Amt"/><Th ch="Priority"/><Th ch="Status"/><Th ch="Date"/></>)}
              {tab==="items"  && (<><Th ch="#"/><Th ch="Item Name"/><Th ch="Qty Sold"/><Th ch="Revenue"/></>)}
            </tr></thead>
            <tbody>
              {loading ? <SkelRows cols={tab==="orders"?13:tab==="sales"?5:tab==="masala"?7:4} /> :
               rows.length===0 ? (
                <tr><td colSpan={13} style={{ textAlign:"center", padding:"52px 20px", color:"#c4cdd6" }}>
                  <i className="bx bx-receipt" style={{ fontSize:40, display:"block", marginBottom:8 }} />
                  <div style={{ fontSize:14 }}>No data yet. Apply filters and click <strong>Apply</strong>.</div>
                </td></tr>
               ) : rows.map((r,i)=>(
                <tr key={r._id||i} className="frr-tr" style={{ borderBottom:"1px solid #f5f5f5" }}>
                  {tab==="orders" && (<>
                    <Td ch={i+1} muted />
                    <Td ch={r.orderNumber} red bold nowrap />
                    <Td ch={r.customerName} bold />
                    <Td ch={r.customerMobile} muted />
                    <td style={{ padding:"9px 12px" }}><Pill v={r.orderType} /></td>
                    <Td ch={(r.items||[]).length} muted />
                    <Td ch={INR(r.subtotal)} muted />
                    <Td ch={r.discount?INR(r.discount):"—"} muted />
                    <Td ch={r.tax?INR(r.tax):"—"} muted />
                    <td style={{ padding:"9px 12px", fontWeight:800, color:"#059669", whiteSpace:"nowrap" }}>{INR(r.totalAmount)}</td>
                    <td style={{ padding:"9px 12px" }}><Pill v={r.paymentMethod} /></td>
                    <td style={{ padding:"9px 12px" }}><Pill v={r.orderStatus} /></td>
                    <Td ch={fmtDate(r.createdAt)} muted nowrap />
                  </>)}
                  {tab==="sales" && (<>
                    <Td ch={r.date} bold nowrap />
                    <Td ch={r.orders} />
                    <td style={{ padding:"9px 12px", fontWeight:800, color:"#059669" }}>{INR(r.revenue)}</td>
                    <Td ch={INR(r.tax)} muted />
                    <Td ch={INR(r.discount)} muted />
                  </>)}
                  {tab==="masala" && (<>
                    <Td ch={i+1} muted />
                    <Td ch={r.requestId} red bold nowrap />
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
                  {tab==="items" && (<>
                    <Td ch={i+1} muted />
                    <Td ch={r.menuName} bold />
                    <td style={{ padding:"9px 12px", fontWeight:800, color:"#1a1a1a" }}>{r.qty}</td>
                    <td style={{ padding:"9px 12px", fontWeight:800, color:"#059669" }}>{INR(r.revenue)}</td>
                  </>)}
                </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FranchiseReport;
