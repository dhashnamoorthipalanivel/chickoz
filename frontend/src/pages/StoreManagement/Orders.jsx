import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../../store/store";

const fmt = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const fmt_date = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};

const orderStatusPill = (status) => {
  const map = {
    COMPLETED: { color:"#059669", bg:"rgba(5,150,105,0.08)",  border:"rgba(5,150,105,0.22)",  icon:"bx-check-circle" },
    PREPARING: { color:"#D97706", bg:"rgba(217,119,6,0.09)",  border:"rgba(217,119,6,0.25)",  icon:"bx-time-five"    },
    PENDING:   { color:"#6b7280", bg:"rgba(107,114,128,0.08)",border:"rgba(107,114,128,0.22)",icon:"bx-hourglass"    },
    CANCELLED: { color:"#D91E18", bg:"rgba(217,30,24,0.08)",  border:"rgba(217,30,24,0.22)",  icon:"bx-x-circle"    },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, fontSize:11.5, fontWeight:700, letterSpacing:0.3, color:s.color, background:s.bg, border:`1px solid ${s.border}`, whiteSpace:"nowrap" }}>
      <i className={`bx ${s.icon}`} style={{ fontSize:13 }}/>{fmt(status)}
    </span>
  );
};

const payStatusPill = (status) => {
  const paid = status === "PAID";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, fontSize:11.5, fontWeight:700, color:paid?"#059669":"#D91E18", background:paid?"rgba(5,150,105,0.08)":"rgba(217,30,24,0.08)", border:`1px solid ${paid?"rgba(5,150,105,0.22)":"rgba(217,30,24,0.22)"}`, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:paid?"#059669":"#D91E18", flexShrink:0 }}/>{paid?"Paid":"Pending"}
    </span>
  );
};

const orderTypePill = (type) => {
  const map = {
    DINE_IN:       { color:"#7c3aed", bg:"rgba(124,58,237,0.08)", border:"rgba(124,58,237,0.22)", icon:"bx-restaurant"  },
    TAKE_AWAY:     { color:"#F97316", bg:"rgba(249,115,22,0.09)", border:"rgba(249,115,22,0.25)", icon:"bx-shopping-bag" },
    HOME_DELIVERY: { color:"#2563eb", bg:"rgba(37,99,235,0.08)",  border:"rgba(37,99,235,0.22)",  icon:"bx-cycling"     },
  };
  const s = map[type] || { color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb", icon:"bx-box" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, fontSize:11.5, fontWeight:700, color:s.color, background:s.bg, border:`1px solid ${s.border}`, whiteSpace:"nowrap" }}>
      <i className={`bx ${s.icon}`} style={{ fontSize:13 }}/>{fmt(type)}
    </span>
  );
};

const payMethodPill = (method) => {
  const map = {
    CASH:   { color:"#059669", icon:"bx-money-withdraw"          },
    CARD:   { color:"#2563eb", icon:"bx-credit-card"             },
    UPI:    { color:"#7c3aed", icon:"bx-qr"                      },
    WALLET: { color:"#F97316", icon:"bx-wallet"                  },
    OTHER:  { color:"#6b7280", icon:"bx-dots-horizontal-rounded" },
  };
  const s = map[method] || map.OTHER;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:s.color, background:"#f9fafb", border:"1px solid #e5e7eb", whiteSpace:"nowrap" }}>
      <i className={`bx ${s.icon}`} style={{ fontSize:13 }}/>{fmt(method)}
    </span>
  );
};

const Orders = () => {
  const [search,        setSearch]        = useState("");
  const [orderStatus,   setOrderStatus]   = useState("ALL");
  const [payStatus,     setPayStatus]     = useState("ALL");
  const [orderType,     setOrderType]     = useState("ALL");
  const [page,          setPage]          = useState(1);
  const [perPage,       setPerPage]       = useState(10);

  const { orders, loading, fetchMyOrders } = useOrderStore();
  useEffect(() => { fetchMyOrders(); }, []);

  const filtered = orders.filter(o =>
    (o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
     o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
     o.tableNo?.toLowerCase().includes(search.toLowerCase())) &&
    (orderStatus === "ALL" || o.orderStatus === orderStatus) &&
    (payStatus   === "ALL" || o.paymentStatus === payStatus) &&
    (orderType   === "ALL" || o.orderType === orderType)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content"><div className="container-fluid">

        {/* ── Page Title ── */}
        <div className="row"><div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow:"0 4px 14px rgba(217,30,24,0.32)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="bx bx-receipt" style={{ color:"#fff", fontSize:22 }}/>
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight:800, fontSize:18, color:"#1A1A1A" }}>My Orders</h4>
                <div style={{ fontSize:12, color:"#F97316", fontWeight:600, marginTop:1 }}>Store · Orders</div>
              </div>
            </div>
            <ol className="breadcrumb m-0">
              <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item active">Orders</li>
            </ol>
          </div>
        </div></div>

        {/* ── Card ── */}
        <div className="row"><div className="col-12"><div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <h4 className="card-title mb-0">Order Records</h4>
                <span style={{ background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:700, boxShadow:"0 2px 6px rgba(217,30,24,0.3)" }}>
                  {filtered.length}
                </span>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => fetchMyOrders()} title="Refresh">
                <i className="bx bx-refresh me-1"/>Refresh
              </button>
            </div>
          </div>

          <div className="card-body">
            {/* ── Filters ── */}
            <div className="row mb-3 g-2 align-items-center">
              <div className="col-auto d-flex align-items-center gap-2">
                <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap" }}>Show</span>
                <select className="form-select form-select-sm" style={{ width:70 }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[5,10,25,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap" }}>entries</span>
              </div>
              <div className="col-sm-12 col-md-3">
                <div className="position-relative">
                  <input type="text" className="form-control" placeholder="Search by order#, customer, table..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
                  <i className="bx bx-search position-absolute" style={{ top:"50%", right:12, transform:"translateY(-50%)", color:"#adb5bd" }}/>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={orderType} onChange={e => { setOrderType(e.target.value); setPage(1); }}>
                  <option value="ALL">All Types</option>
                  <option value="DINE_IN">Dine In</option>
                  <option value="TAKE_AWAY">Take Away</option>
                  <option value="HOME_DELIVERY">Home Delivery</option>
                </select>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={payStatus} onChange={e => { setPayStatus(e.target.value); setPage(1); }}>
                  <option value="ALL">All Payment</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={orderStatus} onChange={e => { setOrderStatus(e.target.value); setPage(1); }}>
                  <option value="ALL">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="col text-end">
                <span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</span>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="table-responsive" style={{ overflowX:"auto" }}>
              <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th style={{ width:50 }}>S.No</th>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Order Type</th>
                    <th>Table / Token</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Payment</th>
                    <th>Pay Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="12" className="text-center py-5 text-muted">
                      <span className="spinner-border spinner-border-sm me-2"/>Loading orders...
                    </td></tr>
                  ) : paged.length === 0 ? (
                    <tr><td colSpan="12" className="text-center py-5 text-muted">
                      <i className="bx bx-receipt display-4 d-block mb-2"/>No orders found.
                    </td></tr>
                  ) : paged.map((row, i) => (
                    <tr key={row._id}>
                      <td>{(page - 1) * perPage + i + 1}</td>
                      <td>
                        <div style={{ fontWeight:700, fontSize:13, color:"#1A1A1A" }}>{row.orderNumber || "—"}</div>
                      </td>
                      <td style={{ maxWidth:160 }}>
                        <div style={{ fontWeight:600, fontSize:13, color:"#1A1A1A", overflow:"hidden", textOverflow:"ellipsis" }}>{row.customerName || "Walk-in"}</div>
                        {row.customerMobile && <div style={{ fontSize:11.5, color:"#9ca3af" }}>{row.customerMobile}</div>}
                      </td>
                      <td>{orderTypePill(row.orderType)}</td>
                      <td><span style={{ fontWeight:600, color:"#374151" }}>{row.tableNo || "—"}</span></td>
                      <td>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#F97316", background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.22)", whiteSpace:"nowrap" }}>
                          <i className="bx bx-bowl-hot" style={{ fontSize:13 }}/>{row.items?.length || 0} item{row.items?.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight:800, color:"#059669", fontSize:14 }}>₹{row.totalAmount?.toFixed(2) ?? "0.00"}</div>
                      </td>
                      <td>{payMethodPill(row.paymentMethod)}</td>
                      <td>{payStatusPill(row.paymentStatus)}</td>
                      <td>{orderStatusPill(row.orderStatus)}</td>
                      <td><span style={{ fontSize:12.5, color:"#374151" }}>{fmt_date(row.createdAt)}</span></td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link to={`/store-management-orders/view/${row._id}`} state={{ rowData: row }} className="ckz-action-btn ckz-action-edit" title="View">
                            <i className="bx bx-show"/>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                <div className="text-muted font-size-13">
                  Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                </div>
                <ul className="pagination pagination-rounded mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p => p - 1)}><i className="bx bx-chevron-left"/></button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p => p + 1)}><i className="bx bx-chevron-right"/></button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div></div></div>

      </div></div>
    </React.Fragment>
  );
};

export default Orders;
