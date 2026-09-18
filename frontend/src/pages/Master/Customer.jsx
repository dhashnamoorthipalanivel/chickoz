import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerStore, useFranchiseStore } from "../../store/store";

const formatLabel = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";



const Customer = () => {
  const [search, setSearch] = useState("");
  const [franchiseFilter, setFranchiseFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { customers, getAllCustomers, customerLoading } = useCustomerStore();
  const { franchises, fetchFranchises } = useFranchiseStore();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const isFranchise = role === "user" || role === "franchise";
  const franchiseId = isFranchise ? (user?.franchiseId || user?.franchise?._id || user?.franchise) : null;

  useEffect(() => {
    // If franchise, only fetch their customers. If Admin, fetch all (or pass franchiseId if filtering by it in future).
    getAllCustomers(franchiseId);
    if (!isFranchise) fetchFranchises();
  }, [getAllCustomers, fetchFranchises, isFranchise, franchiseId]);

  const filtered = (customers || []).filter(item => {
    const q = search.toLowerCase();
    const match =
      (item.customerRefId || "").toLowerCase().includes(q) ||
      (item.customerName || "").toLowerCase().includes(q) ||
      (item.mobile || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q);

    let sMatch = true;
    if (!isFranchise && franchiseFilter !== "ALL") {
      const rowFid = typeof item.creatorFranchiseId === "object" ? item.creatorFranchiseId?._id : item.creatorFranchiseId;
      sMatch = rowFid === franchiseFilter;
    }
    return match && sMatch;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row"><div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow: "0 4px 14px rgba(217,30,24,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="bx bx-user" style={{ color: "#fff", fontSize: 22 }} />
                </div>
                <div>
                  <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Customer Management</h4>
                  <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>Masters · Customer</div>
                </div>
              </div>
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Customer</li>
              </ol>
            </div>
          </div></div>

          <div className="row"><div className="col-12"><div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h4 className="card-title mb-0">Customer Records</h4>
                  <span style={{ background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", borderRadius: 10, padding: "2px 9px", fontSize: 11, fontWeight: 700, boxShadow: "0 2px 6px rgba(217,30,24,0.3)" }}>{filtered.length}</span>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3 g-2 align-items-center">
                <div className="col-auto d-flex align-items-center gap-2">
                  <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
                  <select className="form-select form-select-sm" style={{ width: 70 }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>{[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}</select>
                  <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>entries</span>
                </div>
                <div className="col-sm-12 col-md-4">
                  <div className="position-relative">
                    <input type="text" className="form-control" placeholder="Search by name, ID, or phone..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    <i className="bx bx-search position-absolute" style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: "#adb5bd" }} />
                  </div>
                </div>
                {!isFranchise && (
                  <div className="col-sm-6 col-md-3">
                    <select className="form-select" value={franchiseFilter} onChange={e => { setFranchiseFilter(e.target.value); setPage(1); }}>
                      <option value="ALL">All Franchises</option>
                      {franchises?.map(f => (
                        <option key={f._id} value={f._id}>{f.franchiseName || f.franchiseId}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col text-end"><span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</span></div>
              </div>

              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 60 }}>S.No</th>
                      <th>Customer ID</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      {!isFranchise && <th>Creator Franchise</th>}
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={!isFranchise ? "7" : "6"} className="text-center py-5 text-muted">
                        <i className="bx bx-search-alt display-4 d-block mb-2" />
                        No customer records found.
                      </td>
                    </tr>
                  ) : (
                    paged.map((row, i) => (
                      <tr key={row._id || i}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ fontWeight: 600, color: "#3b82f6" }}>{row.customerRefId || row._id || "-"}</td>
                        <td>{row.customerName}</td>
                        <td>{row.mobile || "-"}</td>
                        <td>{row.email || "-"}</td>
                        {!isFranchise && <td>{row.creatorFranchiseId?.franchiseName || "-"}</td>}
                        <td>{new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                  <div className="text-muted font-size-13">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries</div>
                  <ul className="pagination pagination-rounded mb-0">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(p => p - 1)}><i className="bx bx-chevron-left" /></button></li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <li key={p} className={`page-item ${page === p ? "active" : ""}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>)}
                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(p => p + 1)}><i className="bx bx-chevron-right" /></button></li>
                  </ul>
                </div>
              )}
            </div>
          </div></div></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Customer;
