import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFranchiseStore } from "../../../store/store";
import { toast } from "react-toastify";

const formatLabel = (value) => {
  if (!value) return "";
  return value.toString().toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const TYPE_STYLE = {
  FRANCHISE: { color: "#1D4ED8", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", icon: "bx-store" },
  OUTLET: { color: "#B45309", bg: "rgba(245,158,11,0.09)", border: "rgba(245,158,11,0.22)", icon: "bx-building-house" },
  HEAD_OFFICE: { color: "#065F46", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", icon: "bx-building" },
  KITCHEN: { color: "#D91E18", bg: "rgba(217,30,24,0.07)", border: "rgba(217,30,24,0.18)", icon: "bx-restaurant" },
  WAREHOUSE: { color: "#374151", bg: "#f3f4f6", border: "#e5e7eb", icon: "bx-archive" },
};



const statusBadge = (status) => {
  const active = status === "ACTIVE";
  const pending = status === "PENDING" || status === "UNDER_MAINTENANCE";
  const color = active ? "#065F46" : pending ? "#B45309" : "#991B1B";
  const bg = active ? "rgba(16,185,129,0.08)" : pending ? "rgba(245,158,11,0.09)" : "rgba(153,27,27,0.07)";
  const bdr = active ? "rgba(16,185,129,0.2)" : pending ? "rgba(245,158,11,0.22)" : "rgba(153,27,27,0.18)";
  const dot = active ? "#10B981" : pending ? "#F59E0B" : "#991B1B";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 20,
      fontSize: 11.5, fontWeight: 700,
      color, background: bg, border: `1px solid ${bdr}`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      {formatLabel(status)}
    </span>
  );
};

const Franchise = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showCredModal, setShowCredModal] = useState(false);
  const [selectedCreds, setSelectedCreds] = useState(null);

  const { franchises, fetchFranchises, loading } = useFranchiseStore();

  useEffect(() => { fetchFranchises(); }, []);

  const filtered = franchises.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      item.franchiseName?.toLowerCase().includes(q) ||
      item.franchiseId?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.franchiseCode?.toLowerCase().includes(q) ||
      item.manager?.toLowerCase().includes(q) ||
      item.ownerName?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchType = typeFilter === "ALL" || item.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">

          {/* ── Page header ── */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "linear-gradient(135deg, #D91E18 0%, #F97316 100%)",
                    boxShadow: "0 4px 14px rgba(217,30,24,0.32)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className="bx bx-store-alt" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>
                      Franchise Management
                    </h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>
                      Masters · Franchise
                    </div>
                  </div>
                </div>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Franchise Management</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card ── */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h4 className="card-title mb-0">Franchise Records</h4>
                      <span style={{
                        background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)",
                        color: "#fff", borderRadius: 10,
                        padding: "2px 9px", fontSize: 11, fontWeight: 700,
                        boxShadow: "0 2px 6px rgba(217,30,24,0.3)",
                      }}>{filtered.length}</span>
                    </div>
                    {/* <Link
                      to="/master-franchise/add"
                      className="btn btn-primary"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "8px 18px", borderRadius: 10,
                        fontWeight: 700, fontSize: 13.5,
                      }}
                    >
                      <i className="bx bx-plus" style={{ fontSize: 16 }} /> Add Franchise
                    </Link> */}
                  </div>
                </div>

                <div className="card-body">
                  {/* ── Filters ── */}
                  <div className="row mb-3 g-2 align-items-center">
                    <div className="col-auto d-flex align-items-center gap-2">
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
                      <select className="form-select form-select-sm" style={{ width: 70 }} value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                        {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>entries</span>
                    </div>
                    <div className="col-sm-12 col-md-4">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, ID, code, location or manager..."
                          value={search}
                          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                        <i className="bx bx-search position-absolute" style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: "#adb5bd" }} />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-2">
                      <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-2">
                      <select className="form-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                        <option value="ALL">All Types</option>
                        <option value="FRANCHISE">Franchise</option>
                        <option value="OUTLET">Outlet</option>
                        <option value="HEAD_OFFICE">Head Office</option>
                        <option value="KITCHEN">Kitchen</option>
                        <option value="WAREHOUSE">Warehouse</option>
                      </select>
                    </div>
                    <div className="col-md-2 text-end d-flex align-items-center justify-content-md-end">
                      <span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</span>
                    </div>
                  </div>

                  {/* ── Table ── */}
                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: "#D91E18", width: 36, height: 36, borderWidth: 3 }} role="status" />
                        <div style={{ fontSize: 13, color: "#98a2b3", marginTop: 12 }}>Loading franchises...</div>
                      </div>
                    ) : (
                      <table className="table table-hover table-centered align-middle mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th style={{ width: 50 }}>S.No</th>
                            <th>Franchise</th>
                            <th>Owner / Manager</th>
                            <th>Contact</th>
                            <th>Package</th>
                            <th>Business Status</th>
                            <th>Opening Date</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paged.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center py-5 text-muted">
                                <i className="bx bx-search-alt display-4 d-block mb-2" />
                                No franchise records found.
                              </td>
                            </tr>
                          ) : paged.map((row, index) => (
                            <tr key={row._id}>
                              <td style={{ color: "#98a2b3", fontSize: 12 }}>{(page - 1) * perPage + index + 1}</td>
                              <td>
                                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>{row.franchiseName}</div>
                                <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginTop: 1 }}>{row.franchiseId}</div>
                                {row.referenceId && (
                                  <div style={{ fontSize: 11, color: "#d1d5db", fontFamily: "monospace" }}>ref: {row.referenceId}</div>
                                )}
                              </td>
                              <td>
                                {row.ownerName && (
                                  <div style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>
                                    <i className="bx bx-user" style={{ fontSize: 11, marginRight: 3, color: "#9ca3af" }} />{row.ownerName}
                                  </div>
                                )}
                                {row.manager && (
                                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
                                    <i className="bx bx-briefcase" style={{ fontSize: 11, marginRight: 3 }} />{row.manager}
                                  </div>
                                )}
                              </td>
                              <td>
                                {row.contact && (
                                  <div style={{ fontSize: 12.5, color: "#374151" }}>
                                    <i className="bx bx-phone" style={{ fontSize: 11, marginRight: 3, color: "#9ca3af" }} />{row.contact}
                                  </div>
                                )}
                                {row.email && (
                                  <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1 }}>
                                    <i className="bx bx-envelope" style={{ fontSize: 11, marginRight: 3 }} />{row.email}
                                  </div>
                                )}
                              </td>
                              {/* <td>{typeBadge(row.type)}</td> */}
                              <td>
                                {row.packageName ? (
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    padding: "4px 10px", borderRadius: 20,
                                    fontSize: 11.5, fontWeight: 700,
                                    color: "#D91E18", background: "rgba(217,30,24,0.07)",
                                    border: "1px solid rgba(217,30,24,0.18)",
                                    whiteSpace: "nowrap",
                                  }}>
                                    <i className="bx bx-package" style={{ fontSize: 12 }} />
                                    {row.packageName}
                                  </span>
                                ) : (
                                  <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>
                                )}
                              </td>
                              <td>{statusBadge(row.status)}</td>
                              <td style={{ fontSize: 12.5, color: "#374151" }}>
                                {row.openingDate ? new Date(row.openingDate).toLocaleDateString("en-GB") : "—"}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCreds(row);
                                      setShowCredModal(true);
                                    }}
                                    className="ckz-action-btn"
                                    style={{ color: "#4f46e5", background: "rgba(79, 70, 229, 0.1)" }}
                                    title="View Credentials"
                                  >
                                    <i className="bx bx-clipboard" />
                                  </button>
                                  <Link
                                    to={`/master-franchise/edit/${row._id}`}
                                    state={{ rowData: row }}
                                    className="ckz-action-btn ckz-action-edit"
                                    title="Edit Franchise"
                                  >
                                    <i className="bx bx-edit-alt" />
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
                        Showing {(page - 1) * perPage + 1} – {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                      </div>
                      <ul className="pagination pagination-rounded mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage(p => p - 1)}><i className="bx bx-chevron-left" /></button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                          </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage(p => p + 1)}><i className="bx bx-chevron-right" /></button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Credentials Modal */}
      {showCredModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowCredModal(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
              <div className="modal-content border-0" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
                <div className="modal-header border-0 pb-0" style={{ padding: "24px 24px 10px" }}>
                  <h5 className="modal-title fw-bold" style={{ color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="bx bx-shield-quarter text-primary" style={{ fontSize: 22 }} />
                    Franchise Login Credentials
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowCredModal(false)}></button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 16, border: "1px solid #e9ecef", marginBottom: 16 }}>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Username (Email)</label>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{selectedCreds?.email || "N/A"}</div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Password</label>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{selectedCreds?.password || "Not set"}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const textToCopy = `Username: ${selectedCreds?.email || "N/A"}\nPassword: ${selectedCreds?.password || "Not set"}`;
                      navigator.clipboard.writeText(textToCopy);
                      toast.success("Credentials copied to clipboard!");
                      setShowCredModal(false);
                    }}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4f46e5 0%,#6366f1 100%)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 4px 16px rgba(79,70,229,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <i className="bx bx-copy" style={{ fontSize: 16 }} />
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </React.Fragment>
  );
};

export default Franchise;
