import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMasalaRequestStore } from "../../../store/store";

const formatLabel = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const statusPill = (status) => {
  const map = {
    REQUESTED:    { color:"#6b7280", bg:"#f3f4f6",                  border:"#e5e7eb"                  },
    UNDER_REVIEW: { color:"#d97706", bg:"rgba(217,119,6,0.08)",      border:"rgba(217,119,6,0.22)"     },
    APPROVED:     { color:"#2563eb", bg:"rgba(37,99,235,0.08)",      border:"rgba(37,99,235,0.2)"      },
    DISPATCHED:   { color:"#7c3aed", bg:"rgba(124,58,237,0.08)",     border:"rgba(124,58,237,0.2)"     },
    DELIVERED:    { color:"#059669", bg:"rgba(5,150,105,0.08)",      border:"rgba(5,150,105,0.2)"      },
    REJECTED:     { color:"#D91E18", bg:"rgba(217,30,24,0.08)",      border:"rgba(217,30,24,0.18)"     },
  };
  const s = map[status] || { color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, fontSize:11.5, fontWeight:700, letterSpacing:0.3, color:s.color, background:s.bg, border:`1px solid ${s.border}`, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.color, flexShrink:0 }}/>
      {formatLabel(status)}
    </span>
  );
};

const priorityPill = (priority) => {
  const isUrgent = priority === "Urgent" || priority === "URGENT";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color: isUrgent ? "#D91E18" : "#2563eb", background: isUrgent ? "rgba(217,30,24,0.08)" : "rgba(37,99,235,0.08)", border:`1px solid ${isUrgent ? "rgba(217,30,24,0.2)" : "rgba(37,99,235,0.2)"}`, whiteSpace:"nowrap" }}>
      <i className={`bx ${isUrgent ? "bx-error" : "bx-check-circle"}`} style={{ fontSize:13 }}/>
      {priority}
    </span>
  );
};

const paymentPill = (option) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#059669", background:"rgba(5,150,105,0.08)", border:"1px solid rgba(5,150,105,0.2)", whiteSpace:"nowrap" }}>
    <i className="bx bx-rupee" style={{ fontSize:13 }}/>{option || "—"}
  </span>
);

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
};

const MasalaFranchiseRequest = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { requests, fetchMyRequests, loading } = useMasalaRequestStore();

  useEffect(() => { fetchMyRequests(); }, []);

  const filtered = requests.filter(item =>
    (item.requestId?.toLowerCase().includes(search.toLowerCase()) ||
     item.franchise?.franchiseId?.toLowerCase().includes(search.toLowerCase()) ||
     item.franchise?.franchiseName?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || item.status === statusFilter) &&
    (priorityFilter === "ALL" || item.priority === priorityFilter)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content"><div className="container-fluid">

        {/* ── Page header ── */}
        <div className="row"><div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow:"0 4px 14px rgba(217,30,24,0.32)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="bx bx-bowl-hot" style={{ color:"#fff", fontSize:22 }}/>
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight:800, fontSize:18, color:"#1A1A1A" }}>Masala Franchise Requests</h4>
                <div style={{ fontSize:12, color:"#F97316", fontWeight:600, marginTop:1 }}>Masala · Franchise Request</div>
              </div>
            </div>
            <ol className="breadcrumb m-0">
              <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item active">Franchise Requests</li>
            </ol>
          </div>
        </div></div>

        {/* ── Card ── */}
        <div className="row"><div className="col-12"><div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <h4 className="card-title mb-0">Request Records</h4>
                <span style={{ background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:700, boxShadow:"0 2px 6px rgba(217,30,24,0.3)" }}>{filtered.length}</span>
              </div>
              <Link to="/manufacture-masala-franchise-request/add" className="btn btn-sm btn-primary">
                <i className="bx bx-plus me-1"/>Create Request
              </Link>
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
                  <input type="text" className="form-control" placeholder="Search by request ID, franchise..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
                  <i className="bx bx-search position-absolute" style={{ top:"50%", right:12, transform:"translateY(-50%)", color:"#adb5bd" }}/>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}>
                  <option value="ALL">All Priority</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                  <option value="ALL">All Status</option>
                  <option value="REQUESTED">Requested</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="col text-end">
                <span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</span>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="table-responsive" style={{ overflowX:"auto" }}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color:"#D91E18", width:36, height:36, borderWidth:3 }} role="status"/>
                  <div style={{ fontSize:13, color:"#98a2b3", marginTop:12 }}>Loading requests...</div>
                </div>
              ) : (
                <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width:50 }}>S.No</th>
                      <th>Request ID</th>
                      <th>Franchise</th>
                      <th>Items</th>
                      <th>Total Qty</th>
                      <th>Required Date</th>
                      <th>Priority</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 ? (
                      <tr><td colSpan="11" className="text-center py-5 text-muted">
                        <i className="bx bx-search-alt display-4 d-block mb-2"/>No request records found.
                      </td></tr>
                    ) : paged.map((row, i) => (
                      <tr key={row._id}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td>
                          <span style={{ fontFamily:"monospace", fontSize:12.5, fontWeight:700, color:"#374151" }}>{row.requestId}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight:700, fontSize:13.5, color:"#1A1A1A" }}>{row.franchise?.franchiseName}</div>
                          {row.franchise?.franchiseId && (
                            <div style={{ fontSize:11, color:"#9ca3af", fontFamily:"monospace", marginTop:1 }}>{row.franchise.franchiseId}</div>
                          )}
                        </td>
                        <td>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#F97316", background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.22)", whiteSpace:"nowrap" }}>
                            <i className="bx bx-bowl-hot" style={{ fontSize:13 }}/>{row.totalItems ?? "—"}
                          </span>
                        </td>
                        <td><span style={{ fontWeight:700, color:"#1A1A1A" }}>{row.totalQty ?? "—"}</span></td>
                        <td><span style={{ fontWeight:600, color:"#374151" }}>{fmtDate(row.requiredDate)}</span></td>
                        <td>{priorityPill(row.priority)}</td>
                        <td>{paymentPill(row.paymentOption)}</td>
                        <td>{statusPill(row.status)}</td>
                        <td><span style={{ fontSize:12.5, color:"#6b7280" }}>{fmtDate(row.createdAt)}</span></td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              to={`/manufacture-masala-franchise-request/view/${row._id}`}
                              state={{ rowData: row }}
                              className="ckz-action-btn ckz-action-view"
                              title="View"
                            >
                              <i className="bx bx-show"/>
                            </Link>
                            <Link
                              to={`/manufacture-masala-franchise-request/edit/${row._id}`}
                              state={{ rowData: row }}
                              className="ckz-action-btn ckz-action-edit"
                              title="Edit"
                            >
                              <i className="bx bx-edit-alt"/>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── Pagination ── */}
            {!loading && totalPages > 1 && (
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

export default MasalaFranchiseRequest;
