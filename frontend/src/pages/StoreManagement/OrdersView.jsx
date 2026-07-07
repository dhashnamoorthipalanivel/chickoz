import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useOrderStore } from "../../store/store";

const RED  = "#D91E18";
const GRAD = "linear-gradient(135deg,#D91E18 0%,#F97316 100%)";
const BDR  = "#f0f1f3";

const fmt = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";

const fmt_date = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
};

const orderStatusCfg = {
  COMPLETED: { color:"#059669", bg:"rgba(5,150,105,0.09)",   border:"rgba(5,150,105,0.25)",   icon:"bx-check-circle", label:"Completed"  },
  PREPARING: { color:"#D97706", bg:"rgba(217,119,6,0.09)",   border:"rgba(217,119,6,0.25)",   icon:"bx-time-five",    label:"Preparing"   },
  PENDING:   { color:"#6b7280", bg:"rgba(107,114,128,0.08)", border:"rgba(107,114,128,0.2)",  icon:"bx-hourglass",    label:"Pending"     },
  CANCELLED: { color:"#D91E18", bg:"rgba(217,30,24,0.08)",   border:"rgba(217,30,24,0.22)",   icon:"bx-x-circle",     label:"Cancelled"   },
};

const payStatusCfg = {
  PAID:    { color:"#059669", bg:"rgba(5,150,105,0.09)",   border:"rgba(5,150,105,0.25)"   },
  PENDING: { color:"#D91E18", bg:"rgba(217,30,24,0.08)",   border:"rgba(217,30,24,0.22)"   },
};

const orderTypeCfg = {
  DINE_IN:       { color:"#7c3aed", bg:"rgba(124,58,237,0.08)", border:"rgba(124,58,237,0.22)", icon:"bx-restaurant"  },
  TAKE_AWAY:     { color:"#F97316", bg:"rgba(249,115,22,0.09)", border:"rgba(249,115,22,0.25)", icon:"bx-shopping-bag" },
  HOME_DELIVERY: { color:"#2563eb", bg:"rgba(37,99,235,0.08)",  border:"rgba(37,99,235,0.22)",  icon:"bx-cycling"     },
};

const payMethodIcon = { CASH:"bx-money-withdraw", CARD:"bx-credit-card", UPI:"bx-qr", WALLET:"bx-wallet", OTHER:"bx-dots-horizontal-rounded" };

const Pill = ({ color, bg, border, icon, label }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:700, color, background:bg, border:`1px solid ${border}`, whiteSpace:"nowrap" }}>
    {icon && <i className={`bx ${icon}`} style={{ fontSize:14 }}/>}{label}
  </span>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
    <span style={{ fontSize:10.5, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.8 }}>{label}</span>
    <span style={{ fontSize:13.5, fontWeight:600, color:"#1A1A1A" }}>{value || "—"}</span>
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background:"#fff", borderRadius:16, border:`1.5px solid ${BDR}`, boxShadow:"0 2px 20px rgba(0,0,0,0.06)", overflow:"hidden", ...style }}>
    {children}
  </div>
);

const CardHeader = ({ icon, title, color = RED }) => (
  <div style={{ padding:"14px 20px", borderBottom:`1.5px solid ${BDR}`, display:"flex", alignItems:"center", gap:10 }}>
    <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <i className={`bx ${icon}`} style={{ fontSize:17, color }}/>
    </div>
    <span style={{ fontWeight:800, fontSize:14.5, color:"#1A1A1A" }}>{title}</span>
  </div>
);

const OrdersView = () => {
  const { id }          = useParams();
  const { state }       = useLocation();
  const { fetchOrderById, loading } = useOrderStore();
  const [order, setOrder] = useState(state?.rowData || null);

  useEffect(() => {
    if (id && !order) {
      fetchOrderById(id).then(setOrder).catch(() => {});
    }
  }, [id]);

  if (loading && !order) {
    return (
      <div className="page-content"><div className="container-fluid">
        <div className="text-center py-5"><span className="spinner-border text-danger"/></div>
      </div></div>
    );
  }

  if (!order) {
    return (
      <div className="page-content"><div className="container-fluid">
        <div className="text-center py-5 text-muted">
          <i className="bx bx-error-circle display-4 d-block mb-2"/>Order not found.
          <Link to="/store-management-orders" className="btn btn-sm btn-outline-secondary mt-3">Back to Orders</Link>
        </div>
      </div></div>
    );
  }

  const osCfg   = orderStatusCfg[order.orderStatus] || orderStatusCfg.PENDING;
  const psCfg   = payStatusCfg[order.paymentStatus] || payStatusCfg.PENDING;
  const otCfg   = orderTypeCfg[order.orderType]     || {};
  const pmIcon  = payMethodIcon[order.paymentMethod] || "bx-wallet";
  const itemTotal = (item) => ((item.discountedPrice || 0) + (item.addonTotal || 0)) * (item.qty || 1);

  return (
    <div className="page-content"><div className="container-fluid">

      {/* ── Breadcrumb ── */}
      <div className="row"><div className="col-12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:GRAD, boxShadow:"0 4px 14px rgba(217,30,24,0.32)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="bx bx-receipt" style={{ color:"#fff", fontSize:22 }}/>
            </div>
            <div>
              <h4 className="mb-0" style={{ fontWeight:800, fontSize:18, color:"#1A1A1A" }}>Order Detail</h4>
              <div style={{ fontSize:12, color:"#F97316", fontWeight:600, marginTop:1 }}>Store · Orders · View</div>
            </div>
          </div>
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/store-management-orders">Orders</Link></li>
            <li className="breadcrumb-item active">View</li>
          </ol>
        </div>
      </div></div>

      {/* ── Hero Banner ── */}
      <Card style={{ marginBottom:20 }}>
        <div style={{ padding:"20px 24px", background:"linear-gradient(135deg,rgba(217,30,24,0.04) 0%,rgba(249,115,22,0.03) 100%)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 18px rgba(217,30,24,0.35)", flexShrink:0 }}>
                <i className="bx bx-receipt" style={{ fontSize:28, color:"#fff" }}/>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:"#1A1A1A", letterSpacing:-0.3 }}>{order.orderNumber || "—"}</div>
                <div style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>
                  <i className="bx bx-user me-1"/>
                  <strong>{order.customerName || "Walk-in Customer"}</strong>
                  {order.customerMobile && <span style={{ color:"#9ca3af" }}> · {order.customerMobile}</span>}
                </div>
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>
                  <i className="bx bx-time-five me-1"/>{fmt_date(order.createdAt)}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <Pill color={osCfg.color} bg={osCfg.bg} border={osCfg.border} icon={osCfg.icon} label={osCfg.label}/>
              <Pill color={psCfg.color} bg={psCfg.bg} border={psCfg.border} icon="bx-check" label={order.paymentStatus === "PAID" ? "Paid" : "Pending"}/>
              {otCfg.color && <Pill color={otCfg.color} bg={otCfg.bg} border={otCfg.border} icon={otCfg.icon} label={fmt(order.orderType)}/>}
            </div>
          </div>
        </div>
      </Card>

      <div className="row">
        {/* ── LEFT ── */}
        <div className="col-xl-8">

          {/* Order Items */}
          <Card style={{ marginBottom:20 }}>
            <CardHeader icon="bx-bowl-hot" title="Order Items"/>
            <div style={{ padding:"0 0 4px" }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize:13 }}>
                  <thead className="table-light">
                    <tr>
                      <th style={{ paddingLeft:20 }}>#</th>
                      <th>Item</th>
                      <th>Add-ons</th>
                      <th>Unit Price</th>
                      <th>Qty</th>
                      <th>Tax</th>
                      <th style={{ textAlign:"right", paddingRight:20 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).length === 0
                      ? <tr><td colSpan="7" className="text-center py-4 text-muted">No items</td></tr>
                      : (order.items || []).map((item, i) => (
                        <tr key={i}>
                          <td style={{ paddingLeft:20, color:"#9ca3af", fontSize:12 }}>{i + 1}</td>
                          <td>
                            <div style={{ fontWeight:700, color:"#1A1A1A" }}>{item.menuName}</div>
                            {item.notes && <div style={{ fontSize:11.5, color:"#9ca3af", marginTop:2 }}>{item.notes}</div>}
                          </td>
                          <td>
                            {item.addons?.length > 0
                              ? item.addons.map((a, ai) => (
                                <span key={ai} style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:600, background:"rgba(249,115,22,0.08)", color:"#F97316", border:"1px solid rgba(249,115,22,0.22)", marginRight:4, marginBottom:2 }}>
                                  {a.addonName} {a.price > 0 ? `+₹${a.price}` : ""}
                                </span>
                              ))
                              : <span style={{ color:"#9ca3af", fontSize:12 }}>—</span>}
                          </td>
                          <td>
                            <div style={{ fontWeight:600 }}>₹{(item.discountedPrice || 0).toFixed(2)}</div>
                            {item.basePrice !== item.discountedPrice && <div style={{ fontSize:11, color:"#9ca3af", textDecoration:"line-through" }}>₹{(item.basePrice || 0).toFixed(2)}</div>}
                          </td>
                          <td><span style={{ fontWeight:700, color:"#374151" }}>× {item.qty}</span></td>
                          <td><span style={{ fontSize:12, color:"#6b7280" }}>₹{(item.taxAmount * item.qty || 0).toFixed(2)}</span></td>
                          <td style={{ textAlign:"right", paddingRight:20 }}>
                            <span style={{ fontWeight:800, color:RED, fontSize:14 }}>₹{itemTotal(item).toFixed(2)}</span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Customer Info */}
          <Card style={{ marginBottom:20 }}>
            <CardHeader icon="bx-user" title="Customer Information" color="#7c3aed"/>
            <div style={{ padding:"18px 20px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:18 }}>
              <InfoRow label="Customer Name"   value={order.customerName}   />
              <InfoRow label="Mobile Number"   value={order.customerMobile || "—"} />
              <InfoRow label="Table / Token"   value={order.tableNo || "—"} />
              <InfoRow label="Order Date"      value={fmt_date(order.createdAt)} />
            </div>
          </Card>

        </div>

        {/* ── RIGHT ── */}
        <div className="col-xl-4">

          {/* Order Summary */}
          <Card style={{ marginBottom:16 }}>
            <CardHeader icon="bx-calculator" title="Order Summary" color="#059669"/>
            <div style={{ padding:"16px 20px" }}>
              {[
                { label:"Subtotal",   value:`₹${(order.subtotal  || 0).toFixed(2)}`, bold:false },
                { label:"Discount",   value:`−₹${(order.discount || 0).toFixed(2)}`, bold:false, color:order.discount > 0 ? "#059669" : undefined },
                { label:"Tax",        value:`₹${(order.tax       || 0).toFixed(2)}`, bold:false },
              ].map(r => (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                  <span style={{ fontSize:13, color:"#6b7280" }}>{r.label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:r.color || "#374151" }}>{r.value}</span>
                </div>
              ))}
              <div style={{ height:1, background:BDR, margin:"10px 0 12px" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:800, color:"#1A1A1A" }}>Total Amount</span>
                <span style={{ fontSize:22, fontWeight:900, color:RED }}>₹{(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card style={{ marginBottom:16 }}>
            <CardHeader icon="bx-credit-card" title="Payment Details" color="#2563eb"/>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12.5, color:"#6b7280" }}>Payment Method</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontWeight:700, fontSize:13, color:"#374151" }}>
                  <i className={`bx ${pmIcon}`} style={{ fontSize:16 }}/>{fmt(order.paymentMethod)}
                </span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12.5, color:"#6b7280" }}>Payment Status</span>
                <Pill color={psCfg.color} bg={psCfg.bg} border={psCfg.border} icon="bx-check" label={order.paymentStatus === "PAID" ? "Paid" : "Pending"}/>
              </div>
            </div>
          </Card>

          {/* Order Meta */}
          <Card style={{ marginBottom:16 }}>
            <CardHeader icon="bx-info-circle" title="Order Details" color="#F97316"/>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12.5, color:"#6b7280" }}>Order Type</span>
                {otCfg.color
                  ? <Pill color={otCfg.color} bg={otCfg.bg} border={otCfg.border} icon={otCfg.icon} label={fmt(order.orderType)}/>
                  : <span style={{ fontWeight:600, fontSize:13 }}>{fmt(order.orderType)}</span>}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12.5, color:"#6b7280" }}>Order Status</span>
                <Pill color={osCfg.color} bg={osCfg.bg} border={osCfg.border} icon={osCfg.icon} label={osCfg.label}/>
              </div>
              {order.tableNo && (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12.5, color:"#6b7280" }}>Table / Token</span>
                  <span style={{ fontWeight:700, fontSize:13, color:"#374151" }}>{order.tableNo}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12.5, color:"#6b7280" }}>Total Items</span>
                <span style={{ fontWeight:700, fontSize:13, color:"#F97316" }}>{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div style={{ padding:"16px 20px", display:"grid", gap:10 }}>
              <button className="btn btn-success d-flex align-items-center justify-content-center gap-2" onClick={() => window.print()}>
                <i className="bx bx-printer"/>Print Bill
              </button>
              <Link to="/store-management-orders" className="btn btn-light border d-flex align-items-center justify-content-center gap-2">
                <i className="bx bx-arrow-back"/>Back to Orders
              </Link>
            </div>
          </Card>

        </div>
      </div>

    </div></div>
  );
};

export default OrdersView;
