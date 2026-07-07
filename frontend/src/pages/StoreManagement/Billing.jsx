import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import NewCustomerModal from "./NewCustomerModal";
import { useAuthStore, useCustomerStore, useFranchiseMenuStore } from "../../store/store";
import Select from "react-select";

/* ─── Tokens ──────────────────────────────────────────────────────── */
const RED   = "#D91E18";
const DARK  = "#111827";
const MUTED = "#9ca3af";
const BDR   = "#f0f1f3";
const GREEN = "#059669";
const GRAD  = "linear-gradient(135deg,#D91E18 0%,#F97316 100%)";
const CARD  = "#ffffff";
const BG    = "#f5f6fa";

/* ─── Config ──────────────────────────────────────────────────────── */
const OT_LIST = [
  { value:"TAKE_AWAY",     label:"Take Away", icon:"bx-shopping-bag" },
  { value:"DINE_IN",       label:"Dine In",   icon:"bx-restaurant"   },
  { value:"HOME_DELIVERY", label:"Delivery",  icon:"bx-cycling"      },
];
const PM_LIST = [
  { value:"CASH",   label:"Cash",   icon:"bx-money-withdraw"          },
  { value:"CARD",   label:"Card",   icon:"bx-credit-card"             },
  { value:"UPI",    label:"UPI",    icon:"bx-qr"                      },
  { value:"WALLET", label:"Wallet", icon:"bx-wallet"                  },
  { value:"OTHER",  label:"Other",  icon:"bx-dots-horizontal-rounded"  },
];
const TABLES = ["Table 1","Table 2","Table 3","Table 4","Table 5","Table 6","Table 7","Table 8","Counter","Takeaway"];

const catIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n === "all")                                                    return "bx-grid-alt";
  if (n.includes("burger"))                                           return "bx-bowl-hot";
  if (n.includes("chicken") || n.includes("bucket"))                 return "bx-bowl-hot";
  if (n.includes("wrap") || n.includes("roll") || n.includes("frank")) return "bx-food-tag";
  if (n.includes("snack") || n.includes("frie"))                     return "bx-cookie";
  if (n.includes("bev") || n.includes("drink") || n.includes("juice") || n.includes("cola")) return "bx-droplet";
  if (n.includes("dessert") || n.includes("sweet") || n.includes("cake")) return "bx-lemon";
  if (n.includes("combo"))                                            return "bx-package";
  if (n.includes("add"))                                              return "bx-plus-circle";
  if (n.includes("side"))                                             return "bx-food-tag";
  return "bx-bowl-hot";
};

/* react-select inside top bar — invisible control, value in red */
const rsTopBar = {
  control:            (b) => ({ ...b, border:"none", boxShadow:"none", background:"transparent", minHeight:22, cursor:"pointer" }),
  indicatorSeparator: ()  => ({ display:"none" }),
  dropdownIndicator:  (b) => ({ ...b, padding:"0 0 0 2px", color:MUTED }),
  valueContainer:     (b) => ({ ...b, padding:0 }),
  singleValue:        (b) => ({ ...b, fontSize:14, fontWeight:700, color:RED, margin:0 }),
  placeholder:        (b) => ({ ...b, fontSize:14, color:RED, fontWeight:600, margin:0 }),
  menu:               (b) => ({ ...b, borderRadius:12, boxShadow:"0 10px 36px rgba(0,0,0,0.14)", border:"1px solid #eee", zIndex:9999, minWidth:240 }),
  option:             (b,s) => ({ ...b, fontSize:13, background:s.isSelected ? RED : s.isFocused ? "rgba(217,30,24,0.06)" : "#fff", color:s.isSelected ? "#fff" : DARK }),
};

/* ═══════════════════════════════════════════════════════════════════ */
const Billing = () => {
  const { franchise, fetchProfile }           = useAuthStore();
  const { menus, fetchMyMenus }               = useFranchiseMenuStore();
  const { getFranchiseCustomers }             = useCustomerStore();

  const [cat,       setCat]       = useState("All");
  const [search,    setSearch]    = useState("");
  const [sortBy,    setSortBy]    = useState("POPULAR");
  const [orderType, setOrderType] = useState("DINE_IN");
  const [table,     setTable]     = useState("Table 1");
  const [cart,      setCart]      = useState([]);
  const [customer,  setCustomer]  = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selProd,   setSelProd]   = useState(null);
  const [showProd,  setShowProd]  = useState(false);
  const [showCust,  setShowCust]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [payMethod, setPayMethod] = useState("CASH");
  const [amtIn,     setAmtIn]     = useState("");
  const [mobTab,    setMobTab]    = useState("menu");
  const [isMob, setIsMob] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const fn = () => setIsMob(window.innerWidth < 1024);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useLayoutEffect(() => {
    document.body.classList.add("pos-mode");
    return () => document.body.classList.remove("pos-mode");
  }, []);

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    (async () => {
      try { setLoading(true); await fetchMyMenus(); }
      catch {/* ignore */}
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const fid = franchise?._id || franchise?.franchise?._id;
    if (!fid) return;
    getFranchiseCustomers(fid).then(setCustomers).catch(() => {});
  }, [franchise]);

  /* derived */
  const items    = menus.filter((m) => m.isAssigned && m.isVisibleInBilling);
  const cats     = ["All", ...new Set(items.map((m) => m.category).filter(Boolean))];

  const products = useMemo(() => {
    let list = items.filter((p) => {
      const catOk = cat === "All" || p.category === cat;
      const q     = search.toLowerCase();
      const txtOk = p.menuName?.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
      return catOk && txtOk;
    });
    if (sortBy === "NAME")  list = [...list].sort((a, b) => a.menuName.localeCompare(b.menuName));
    if (sortBy === "PRICE") list = [...list].sort((a, b) => +a.price - +b.price);
    return list;
  }, [cat, search, items, sortBy]);

  /* price */
  const price = (p) => {
    const base = +p.price || 0;
    let   disc = base;
    if (p.hasOffer) disc = p.offerType === "PERCENTAGE" ? base - base * (+p.offerValue || 0) / 100 : base - (+p.offerValue || 0);
    disc = Math.max(0, disc);
    const tax = p.isTaxApplicable ? (+p.taxId?.taxPercentage || 0) : 0;
    return { base, disc, tax: disc * tax / 100, final: disc + disc * tax / 100 };
  };

  /* cart ops */
  const addToCart = (product, qty = 1, addons = [], customizations = [], notes = "") => {
    const { base, disc } = price(product);
    const addonAmt  = addons.reduce((s, a) => s + (+a.price || 0), 0);
    const taxPct    = product?.isTaxApplicable ? (+product?.taxId?.taxPercentage || 0) : 0;
    const taxAmt    = (disc + addonAmt) * taxPct / 100;
    const finalPrc  = disc + addonAmt + taxAmt;
    setCart((prev) => [...prev, {
      cartId: Date.now() + Math.random(), ...product, qty,
      addons, customizations, notes,
      basePrice: base, discountedPrice: disc, addonTotal: addonAmt,
      taxAmount: taxAmt, finalPrice: finalPrc,
      offerSaved: (product.hasOffer && +product.offerValue > 0) ? base - disc : 0,
    }]);
    setShowProd(false);
  };

  const upQty = (id, d) => setCart((p) =>
    p.map((i) => i.cartId === id ? { ...i, qty: d === "+" ? i.qty + 1 : i.qty - 1 } : i).filter((i) => i.qty > 0)
  );

  const subtotal  = cart.reduce((s, i) => s + i.discountedPrice * i.qty, 0);
  const taxTot    = cart.reduce((s, i) => s + i.taxAmount * i.qty, 0);
  const discTot   = cart.reduce((s, i) => s + (i.offerSaved || 0) * i.qty, 0);
  const total     = subtotal + taxTot;
  const change    = amtIn && +amtIn > total ? +amtIn - total : 0;
  const otCfg     = OT_LIST.find((t) => t.value === orderType) || OT_LIST[1];

  /* ── CSS injected once ─────────────────────────────────────────── */
  const CSS = `
    @media(min-width:1024px){
      body.pos-mode .main-content{height:100vh!important;overflow:hidden!important;}
      body.pos-mode .page-content{padding-bottom:0!important;overflow:hidden!important;}
    }
    @keyframes posIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer{ 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .pos-shim { background:linear-gradient(90deg,#ececec 25%,#f5f5f5 50%,#ececec 75%);
                background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:14px; }
    .pos-pcard{ transition:box-shadow .2s,transform .2s; }
    .pos-pcard:hover{ transform:translateY(-3px);box-shadow:0 10px 28px rgba(217,30,24,.15) !important; }
    .pos-pcard:hover .pos-addbtn{ opacity:1 !important; }
    .pos-addbtn{ opacity:.85;transition:opacity .2s; }
    .pos-cat:hover:not(.pos-cat-on){ background:rgba(217,30,24,.07) !important;color:#111827 !important; }
    .pos-pm:hover{ border-color:${RED} !important;color:${RED} !important;background:rgba(217,30,24,.05) !important; }
    .pos-scroll::-webkit-scrollbar{width:3px;height:3px}
    .pos-scroll::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px}
    .pos-scroll::-webkit-scrollbar-track{background:transparent}
    .pos-inp:focus{border-color:${RED} !important;background:#fff !important;outline:none}
    .pos-sort:hover{ border-color:${RED} !important;color:${RED} !important; }
  `;

  /* ── shared panel shadow ────────────────────────────────────── */
  const panelStyle = {
    background: CARD,
    borderRadius: 16,
    border: `1.5px solid ${BDR}`,
    boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
  };

  /* ─────────────────────────────────────────────────────────────── */
  /* RENDER                                                          */
  /* ─────────────────────────────────────────────────────────────── */
  return (
    <React.Fragment>
      <style>{CSS}</style>

      {/* ══ MOBILE TAB ════════════════════════════════════════ */}
      {isMob && (
        <div style={{ display:"flex", gap:4, background:"#f3f4f6", borderRadius:14, padding:4, marginBottom:12, border:`1.5px solid ${BDR}` }}>
          {[{k:"menu",l:"Menu",i:"bx-bowl-hot"},{k:"cart",l:`Cart${cart.length?` (${cart.length})`:""}`,i:"bx-cart"}].map(t=>(
            <button key={t.k} type="button" onClick={()=>setMobTab(t.k)} style={{
              flex:1,padding:"10px 8px",borderRadius:10,border:"none",
              fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",
              background:mobTab===t.k?GRAD:"transparent",
              color:mobTab===t.k?"#fff":MUTED,
              boxShadow:mobTab===t.k?"0 3px 10px rgba(217,30,24,.28)":"none",
            }}>
              <i className={`bx ${t.i}`} style={{marginRight:6,fontSize:15,verticalAlign:"middle"}}/>
              {t.l}
            </button>
          ))}
        </div>
      )}

      {/* ══ MAIN LAYOUT ═══════════════════════════════════════ */}
      <div style={{
        display: "flex",
        gap: 14,
        ...(!isMob ? { height: "calc(100vh - 70px - 1.5rem)", minHeight: 0, overflow: "hidden" } : {}),
      }}>

            {/* ── LEFT COLUMN ─────────────────────────────────── */}
            {(!isMob || mobTab==="menu") && (
              <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:12, minHeight:0 }}>

                {/* ▸ TOP INFO BAR */}
                <div style={{ ...panelStyle, display:"flex", overflow:"hidden", flexShrink:0 }}>

                  {/* Customer */}
                  <div style={{ flex:1, padding:"14px 18px", borderRight:`1.5px solid ${BDR}`, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:12,flexShrink:0, background:"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <i className="bx bx-user" style={{ fontSize:22,color:RED }}/>
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:10.5,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:.8,marginBottom:3 }}>Customer</div>
                        <Select
                          options={customers}
                          placeholder="Walk-in Customer"
                          value={customer}
                          getOptionLabel={(c)=>`${c.customerName} (${c.mobile})`}
                          getOptionValue={(c)=>c._id}
                          onChange={setCustomer}
                          styles={rsTopBar}
                          isClearable
                          menuPortalTarget={document.body}
                        />
                        <button type="button" onClick={()=>setShowCust(true)} style={{ marginTop:3, border:"none", background:"none", padding:0, color:RED, fontSize:11.5, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}>
                          <i className="bx bx-plus" style={{ fontSize:13 }}/> Add Customer
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Type */}
                  <div style={{ flex:1, padding:"14px 18px", borderRight:`1.5px solid ${BDR}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:12,flexShrink:0, background:"#fff7ed",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <i className={`bx ${otCfg.icon}`} style={{ fontSize:22,color:"#F97316" }}/>
                      </div>
                      <div>
                        <div style={{ fontSize:10.5,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:.8,marginBottom:4 }}>Order Type</div>
                        <select value={orderType} onChange={(e)=>setOrderType(e.target.value)} style={{ border:"none",background:"transparent",fontSize:14,fontWeight:700,color:DARK,cursor:"pointer",outline:"none",padding:0 }}>
                          {OT_LIST.map((t)=><option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table / Token */}
                  <div style={{ flex:1, padding:"14px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:12,flexShrink:0, background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <i className="bx bx-grid-alt" style={{ fontSize:22,color:"#7c3aed" }}/>
                      </div>
                      <div>
                        <div style={{ fontSize:10.5,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:.8,marginBottom:4 }}>Table / Token</div>
                        <select value={table} onChange={(e)=>setTable(e.target.value)} style={{ border:"none",background:"transparent",fontSize:14,fontWeight:700,color:DARK,cursor:"pointer",outline:"none",padding:0 }}>
                          {TABLES.map((t)=><option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ▸ CATEGORIES + PRODUCTS (shared card) */}
                <div style={{ ...panelStyle, flex:1, minHeight:0, display:"flex", overflow:"hidden" }}>

                  {/* Categories */}
                  <div className="pos-scroll" style={{ width:185,flexShrink:0, overflowY:"auto", padding:"14px 8px", borderRight:`1.5px solid #f5f5f7` }}>
                    <div style={{ fontSize:9.5,fontWeight:800,color:MUTED,textTransform:"uppercase",letterSpacing:1,padding:"0 8px 10px" }}>Categories</div>
                    {cats.map((name,i)=>{
                      const on = cat===name;
                      return (
                        <button key={name} type="button" onClick={()=>setCat(name)}
                          className={`pos-cat ${on?"pos-cat-on":""}`}
                          style={{
                            display:"flex",alignItems:"center",gap:9,
                            width:"100%",padding:"9px 10px",marginBottom:4,
                            borderRadius:10,border:"none",cursor:"pointer",
                            background:on?RED:"transparent",
                            color:on?"#fff":"#374151",
                            fontWeight:on?700:500,fontSize:12.5,
                            textAlign:"left",transition:"all .17s",
                            boxShadow:on?"0 3px 12px rgba(217,30,24,.3)":"none",
                          }}
                        >
                          <div style={{ width:30,height:30,borderRadius:8,flexShrink:0,
                            background:on?"rgba(255,255,255,.2)":"rgba(217,30,24,.08)",
                            display:"flex",alignItems:"center",justifyContent:"center" }}>
                            <i className={`bx ${catIcon(name)}`} style={{ fontSize:16, color:on?"#fff":RED }}/>
                          </div>
                          <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Products area */}
                  <div className="pos-scroll" style={{ flex:1,minWidth:0,overflowY:"auto",display:"flex",flexDirection:"column" }}>

                    {/* Sticky header */}
                    <div style={{ position:"sticky",top:0,zIndex:10,background:CARD, padding:"14px 16px 10px", borderBottom:`1px solid ${BDR}` }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:8 }}>
                        <div style={{ fontSize:15,fontWeight:800,color:DARK }}>
                          {cat==="All"?"All Menu Items":cat}
                          <span style={{ fontSize:12,fontWeight:500,color:MUTED,marginLeft:8 }}>({products.length})</span>
                        </div>
                        <div style={{ display:"flex",gap:7 }}>
                          {[["POPULAR","Popular"],["NAME","Name"],["PRICE","Price"]].map(([k,l])=>(
                            <button key={k} type="button" onClick={()=>setSortBy(k)} className="pos-sort" style={{
                              padding:"5px 13px",borderRadius:20,fontSize:11.5,fontWeight:700,
                              border:`1.5px solid ${sortBy===k?RED:BDR}`,
                              background:sortBy===k?RED:"#fff",
                              color:sortBy===k?"#fff":MUTED,
                              cursor:"pointer",transition:"all .16s",
                            }}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{ position:"relative" }}>
                        <i className="bx bx-search" style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:17,color:MUTED,pointerEvents:"none" }}/>
                        <input
                          type="text" value={search} onChange={(e)=>setSearch(e.target.value)}
                          placeholder="Search in menu..."
                          className="pos-inp"
                          style={{ width:"100%",padding:"9px 12px 9px 36px",border:`1.5px solid ${BDR}`,borderRadius:10,fontSize:13,background:"#f9fafb",transition:"all .2s" }}
                        />
                      </div>
                    </div>

                    {/* Grid */}
                    <div style={{ padding:14 }}>
                      {loading ? (
                        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12 }}>
                          {[...Array(9)].map((_,i)=><div key={i} className="pos-shim" style={{ height:210 }}/>)}
                        </div>
                      ) : products.length===0 ? (
                        <div style={{ textAlign:"center",padding:"56px 16px" }}>
                          <i className="bx bx-search-alt" style={{ fontSize:44,color:"#e5e7eb",display:"block",marginBottom:10 }}/>
                          <div style={{ fontSize:14,color:MUTED }}>No items found</div>
                        </div>
                      ) : (
                        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:13 }}>
                          {products.map((p,idx)=>{
                            const pc = price(p);
                            return (
                              <div key={p._id} className="pos-pcard" onClick={()=>{setSelProd(p);setShowProd(true);}}
                                style={{
                                  background:"#fff",borderRadius:16,cursor:"pointer",
                                  border:`1.5px solid ${BDR}`,overflow:"hidden",
                                  boxShadow:"0 2px 8px rgba(0,0,0,0.05)",position:"relative",
                                }}
                              >
                                {/* Image */}
                                <div style={{ position:"relative",height:130,overflow:"hidden" }}>
                                  <img
                                    src={p.image||"https://placehold.co/300x180/f8f9fa/ccc?text=Menu"}
                                    alt={p.menuName}
                                    style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s" }}
                                  />
                                  {/* Badges */}
                                  {p.hasOffer && (
                                    <span style={{ position:"absolute",top:0,left:0,background:GRAD,color:"#fff",fontSize:9,fontWeight:800,padding:"4px 9px",borderRadius:"0 0 10px 0",letterSpacing:.3 }}>OFFER</span>
                                  )}
                                  {p.isCombo && (
                                    <span style={{ position:"absolute",top:0,right:0,background:"#f59e0b",color:"#fff",fontSize:9,fontWeight:800,padding:"4px 9px",borderRadius:"0 0 0 10px" }}>COMBO</span>
                                  )}
                                  {/* Star */}
                                  <button type="button" onClick={(e)=>e.stopPropagation()} style={{ position:"absolute",top:7,right:7,width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.85)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                    <i className="bx bx-star" style={{ fontSize:14,color:"#9ca3af" }}/>
                                  </button>
                                </div>
                                {/* Info */}
                                <div style={{ padding:"9px 11px 12px" }}>
                                  <div style={{ fontSize:12.5,fontWeight:700,color:DARK,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                                    {p.menuName}
                                  </div>
                                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                                    <div>
                                      <span style={{ fontSize:15,fontWeight:900,color:RED }}>₹{pc.final.toFixed(0)}</span>
                                      {p.hasOffer && <span style={{ fontSize:10.5,color:MUTED,textDecoration:"line-through",marginLeft:4 }}>₹{pc.base.toFixed(0)}</span>}
                                    </div>
                                    {/* + button */}
                                    <div className="pos-addbtn" onClick={(e)=>{e.stopPropagation();addToCart(p);}} style={{
                                      width:30,height:30,borderRadius:"50%",
                                      background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",
                                      boxShadow:"0 3px 10px rgba(217,30,24,.45)",cursor:"pointer",flexShrink:0,
                                    }}>
                                      <i className="bx bx-plus" style={{ fontSize:18,color:"#fff" }}/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Offers strip */}
                      {items.some((i)=>i.hasOffer) && (
                        <div style={{ marginTop:24 }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                            <div style={{ fontSize:14,fontWeight:800,color:DARK }}>Offers &amp; Discounts</div>
                            <span style={{ fontSize:12,color:RED,fontWeight:700,cursor:"pointer" }}>View All Offers →</span>
                          </div>
                          <div className="pos-scroll" style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:4 }}>
                            {items.filter((i)=>i.hasOffer).slice(0,4).map((it)=>{
                              const saved = it.offerType==="PERCENTAGE" ? `${it.offerValue}% OFF` : `₹${it.offerValue} OFF`;
                              return (
                                <div key={it._id} style={{ flexShrink:0,minWidth:185,background:"#fff",borderRadius:12,padding:"11px 13px",border:"1.5px solid #fee2e2",display:"flex",alignItems:"center",gap:11 }}>
                                  <div style={{ width:38,height:38,borderRadius:10,background:"rgba(217,30,24,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                                    <i className="bx bx-purchase-tag" style={{ fontSize:20,color:RED }}/>
                                  </div>
                                  <div style={{ minWidth:0 }}>
                                    <div style={{ fontSize:13,fontWeight:800,color:RED }}>{saved}</div>
                                    <div style={{ fontSize:11.5,color:"#374151",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{it.menuName}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── RIGHT COLUMN — BILL ──────────────────────────── */}
            {(!isMob || mobTab==="cart") && (
              <div style={{ width: isMob?"100%":330, flexShrink:0, display:"flex", flexDirection:"column", ...panelStyle, overflow:"hidden" }}>
                <div className="pos-scroll" style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>

                  {/* Bill header */}
                  <div style={{ padding:"14px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,background:CARD,zIndex:5 }}>
                    <div style={{ fontSize:14,fontWeight:800,color:DARK,display:"flex",alignItems:"center",gap:8 }}>
                      Current Bill
                      {cart.length>0&&<span style={{ background:GRAD,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:20 }}>{cart.length}</span>}
                    </div>
                    {cart.length>0&&(
                      <button type="button" onClick={()=>setCart([])} style={{ border:"none",background:"none",cursor:"pointer",color:RED,fontSize:11.5,fontWeight:700,display:"flex",alignItems:"center",gap:3 }}>
                        <i className="bx bx-trash" style={{ fontSize:14 }}/> Clear Cart
                      </button>
                    )}
                  </div>

                  {/* Cart items */}
                  {cart.length===0 ? (
                    <div style={{ textAlign:"center",padding:"36px 20px",flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                      <div style={{ width:64,height:64,borderRadius:"50%",background:"#f9fafb",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12 }}>
                        <i className="bx bx-cart" style={{ fontSize:30,color:"#d1d5db" }}/>
                      </div>
                      <div style={{ fontSize:13,fontWeight:700,color:"#374151" }}>Your cart is empty</div>
                      <div style={{ fontSize:12,color:MUTED,marginTop:4 }}>Tap any item to add</div>
                    </div>
                  ) : (
                    <div>
                      {cart.map((item,idx)=>(
                        <div key={item.cartId} style={{ display:"flex",gap:10,padding:"11px 14px",borderBottom:`1px solid #f9f9f9` }}>
                          <img src={item.image||"https://placehold.co/50x50/f8f9fa/ccc?text=M"} alt={item.menuName}
                            style={{ width:50,height:50,objectFit:"cover",borderRadius:10,flexShrink:0,border:`1px solid ${BDR}` }}
                          />
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:4,marginBottom:2 }}>
                              <div style={{ fontSize:12.5,fontWeight:700,color:DARK,lineHeight:1.3,flex:1 }}>{item.menuName}</div>
                              <div style={{ fontSize:13,fontWeight:900,color:RED,flexShrink:0 }}>₹{(item.finalPrice*item.qty).toFixed(0)}</div>
                            </div>
                            <div style={{ fontSize:11,color:MUTED,marginBottom:7 }}>₹{item.finalPrice.toFixed(2)} each</div>
                            {/* Stepper */}
                            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                              <button type="button" onClick={()=>upQty(item.cartId,"-")} style={{
                                width:26,height:26,borderRadius:"50%",
                                border:`1.5px solid ${item.qty===1?RED:BDR}`,
                                background:item.qty===1?"rgba(217,30,24,.08)":"#f9fafb",
                                color:item.qty===1?RED:"#374151",
                                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,
                              }}>
                                {item.qty===1?<i className="bx bx-trash" style={{ fontSize:12 }}/>:"−"}
                              </button>
                              <span style={{ fontSize:14,fontWeight:800,color:DARK,minWidth:18,textAlign:"center" }}>{item.qty}</span>
                              <button type="button" onClick={()=>upQty(item.cartId,"+")} style={{
                                width:26,height:26,borderRadius:"50%",border:"none",
                                background:GRAD,color:"#fff",cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,
                                boxShadow:"0 2px 7px rgba(217,30,24,.38)",
                              }}>+</button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add-ons hint */}
                      {cart.some((i)=>i.addons?.length>0)&&(
                        <div style={{ padding:"10px 14px",background:"#fafafa",borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}` }}>
                          <div style={{ fontSize:11.5,fontWeight:700,color:DARK,marginBottom:6 }}>Add-ons / Customization</div>
                          {cart.filter((i)=>i.addons?.length).flatMap((i)=>i.addons).map((a,ai)=>(
                            <div key={ai} style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280",padding:"3px 0" }}>
                              <span>{a.addonName}</span>
                              <span style={{ fontWeight:600,color:DARK }}>₹{+a.price||0}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary + payment (always visible at bottom) */}
                  <div style={{ marginTop:"auto",borderTop:`1.5px solid ${BDR}`,padding:"12px 14px 0" }}>

                    {/* Summary rows */}
                    <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:8 }}>
                      <div style={{ display:"flex",justifyContent:"space-between" }}>
                        <span style={{ fontSize:12.5,color:MUTED }}>Subtotal</span>
                        <span style={{ fontSize:12.5,fontWeight:600,color:"#374151" }}>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {discTot>0&&(
                        <div style={{ display:"flex",justifyContent:"space-between" }}>
                          <span style={{ fontSize:12.5,color:GREEN,fontWeight:600 }}>Discount</span>
                          <span style={{ fontSize:12.5,fontWeight:700,color:GREEN }}>−₹{discTot.toFixed(2)}</span>
                        </div>
                      )}
                      {taxTot>0&&(
                        <div style={{ display:"flex",justifyContent:"space-between" }}>
                          <span style={{ fontSize:12.5,color:MUTED }}>Tax</span>
                          <span style={{ fontSize:12.5,fontWeight:600,color:"#374151" }}>₹{taxTot.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ height:1,background:BDR,marginBottom:10 }}/>

                    {/* Total */}
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                      <span style={{ fontSize:13,fontWeight:800,color:DARK }}>Total Amount</span>
                      <span style={{ fontSize:22,fontWeight:900,color:RED }}>₹{total.toFixed(2)}</span>
                    </div>

                    {/* Payment method */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:10.5,fontWeight:700,color:DARK,textTransform:"uppercase",letterSpacing:.7,marginBottom:8 }}>Payment Method</div>
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:7 }}>
                        {PM_LIST.slice(0,3).map((pm)=>{
                          const on=payMethod===pm.value;
                          return (
                            <button key={pm.value} type="button" onClick={()=>setPayMethod(pm.value)}
                              className={on?"":"pos-pm"}
                              style={{
                                padding:"8px 4px",borderRadius:10,fontSize:11.5,fontWeight:700,
                                border:`1.5px solid ${on?RED:BDR}`,
                                background:on?"rgba(217,30,24,.07)":"#fafafa",
                                color:on?RED:"#374151",
                                cursor:"pointer",transition:"all .16s",
                                display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                              }}
                            >
                              <i className={`bx ${pm.icon}`} style={{ fontSize:18 }}/>
                              {pm.label}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:7 }}>
                        {PM_LIST.slice(3).map((pm)=>{
                          const on=payMethod===pm.value;
                          return (
                            <button key={pm.value} type="button" onClick={()=>setPayMethod(pm.value)}
                              className={on?"":"pos-pm"}
                              style={{
                                padding:"8px 4px",borderRadius:10,fontSize:11.5,fontWeight:700,
                                border:`1.5px solid ${on?RED:BDR}`,
                                background:on?"rgba(217,30,24,.07)":"#fafafa",
                                color:on?RED:"#374151",
                                cursor:"pointer",transition:"all .16s",
                                display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                              }}
                            >
                              <i className={`bx ${pm.icon}`} style={{ fontSize:18 }}/>
                              {pm.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Amount received */}
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                      <span style={{ fontSize:12.5,color:DARK,fontWeight:700 }}>Amount Received</span>
                      <div style={{ position:"relative" }}>
                        <span style={{ position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:13,fontWeight:700,color:MUTED }}>₹</span>
                        <input
                          type="number" value={amtIn} onChange={(e)=>setAmtIn(e.target.value)}
                          placeholder="0"
                          className="pos-inp"
                          style={{ width:100,padding:"6px 8px 6px 20px",border:`1.5px solid ${BDR}`,borderRadius:8,fontSize:13,fontWeight:700,color:DARK,background:"#fafafa",textAlign:"right",transition:"all .2s" }}
                        />
                      </div>
                    </div>

                    {/* Change */}
                    {change>0&&(
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:10,background:"rgba(5,150,105,.07)",border:"1.5px solid rgba(5,150,105,.2)",marginBottom:10 }}>
                        <span style={{ fontSize:12.5,fontWeight:700,color:GREEN }}>Change</span>
                        <span style={{ fontSize:18,fontWeight:900,color:GREEN }}>₹{change.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Confirm */}
                    <button type="button" disabled={cart.length===0} style={{
                      width:"100%",padding:"13px",borderRadius:12,fontSize:14,fontWeight:800,
                      border:"none",cursor:cart.length===0?"not-allowed":"pointer",
                      background:cart.length===0?"#e9ecef":GRAD,
                      color:cart.length===0?MUTED:"#fff",
                      boxShadow:cart.length===0?"none":"0 5px 18px rgba(217,30,24,.38)",
                      transition:"all .2s",marginBottom:9,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                    }}>
                      <i className="bx bx-check-circle" style={{ fontSize:19 }}/>
                      Confirm Payment
                    </button>

                    {/* Hold + Print */}
                    <div style={{ display:"flex",gap:8,paddingBottom:14 }}>
                      {[{l:"Hold Bill",i:"bx-pause-circle"},{l:"Print Bill",i:"bx-printer"}].map(({l,i})=>(
                        <button key={l} type="button"
                          style={{ flex:1,padding:"10px",borderRadius:10,fontSize:12,fontWeight:700,border:`1.5px solid ${BDR}`,background:"#fafafa",color:"#374151",cursor:"pointer",transition:"all .16s",display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}
                          onMouseEnter={(e)=>{e.currentTarget.style.borderColor=DARK;e.currentTarget.style.color=DARK;}}
                          onMouseLeave={(e)=>{e.currentTarget.style.borderColor=BDR;e.currentTarget.style.color="#374151";}}
                        >
                          <i className={`bx ${i}`} style={{ fontSize:15 }}/> {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

      </div>{/* end main layout */}

      {/* Modals */}
      <ProductDetailModal show={showProd} onClose={()=>setShowProd(false)} product={selProd} onAddToCart={addToCart}/>
      <NewCustomerModal
        show={showCust} onClose={()=>setShowCust(false)}
        franchiseId={franchise?._id||franchise?.franchise?._id}
        onCustomerCreated={(c)=>setCustomer(c)}
      />
    </React.Fragment>
  );
};

export default Billing;
