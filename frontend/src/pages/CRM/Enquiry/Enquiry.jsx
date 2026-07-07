import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEnquiryStore } from "../../../store/store";
import { toast } from "react-toastify";

const formatLabel = (value) => {
  if (!value) return "";

  return value
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const STATUS_STYLE = {
  NEW:               { color: "#F97316", bg: "rgba(249,115,22,0.09)", border: "rgba(249,115,22,0.2)" },
  FOLLOW_UP:         { color: "#D91E18", bg: "rgba(217,30,24,0.08)",  border: "rgba(217,30,24,0.18)" },
  CONVERTED_TO_LEAD: { color: "#3B2418", bg: "#F4E7D3",               border: "rgba(59,36,24,0.2)"  },
  HOLD:              { color: "#6b7280", bg: "#f3f4f6",               border: "#e5e7eb"              },
  CANCELLED:         { color: "#1A1A1A", bg: "#f5f5f5",               border: "#d1d5db"              },
};

const statusBadge = (status) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.HOLD;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 20,
      fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3,
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {formatLabel(status)}
    </span>
  );
};

const SOURCE_STYLE = {
  WEBSITE:   { color: "#D91E18", bg: "rgba(217,30,24,0.08)",   border: "rgba(217,30,24,0.15)"  },
  INSTAGRAM: { color: "#F97316", bg: "rgba(249,115,22,0.09)",  border: "rgba(249,115,22,0.18)" },
  FACEBOOK:  { color: "#3B2418", bg: "#F4E7D3",                border: "rgba(59,36,24,0.15)"   },
  REFERENCE: { color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.18)"  },
  WALK_IN:   { color: "#6b7280", bg: "#f3f4f6",                border: "#e5e7eb"                },
};

const leadSourceBadge = (source) => {
  const s = SOURCE_STYLE[source?.toUpperCase()] || { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 20,
      fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3,
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      {source || "—"}
    </span>
  );
};

const Enquiry = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [leadSourceFilter, setLeadSourceFilter] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertId, setConvertId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [converting, setConverting] = useState(false);

  const [perPage, setPerPage] = useState(10);

  // Fetch enquiry from store
  const { enquiries, fetchEnquiries, deleteEnquiry, convertToLead } = useEnquiryStore();

  useEffect(() => {
    fetchEnquiries();
  }, [])

  const filtered = enquiries.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase()) ||
      item.place.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const matchLeadSource =
      leadSourceFilter === "ALL" ||
      item.leadSource?.name === leadSourceFilter;

    return matchSearch && matchStatus && matchLeadSource;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === paged.length) {
      setSelected([]);
    } else {
      setSelected(paged.map((r) => r._id));
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmConvert = (id) => {

  setConvertId(id);

  setShowConvertModal(true);
};

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEnquiry(deleteId);
      await fetchEnquiries();
      toast.success("Enquiry deleted successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      setSelected((prev) => prev.filter((item) => item !== deleteId));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete enquiry");
    } finally {
      setDeleting(false);
    }
  };

  const handleConvertLead = async () => {
    setConverting(true);
    try {
      const enquiryData = enquiries.find((item) => item._id === convertId);
      await convertToLead(convertId);
      await fetchEnquiries();
      toast.success(`${enquiryData?.referenceId} enquiry converted to lead successfully`);
      setShowConvertModal(false);
      setConvertId(null);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to convert enquiry");
    } finally {
      setConverting(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
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
                    <i className="bx bx-user-voice" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>
                      Enquiry Management
                    </h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>
                      CRM · Enquiries
                    </div>
                  </div>
                </div>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      Enquiry
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h4 className="card-title mb-0">Enquiry Records</h4>
                      <span style={{
                        background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)",
                        color: "#fff", borderRadius: 10,
                        padding: "2px 9px", fontSize: 11, fontWeight: 700,
                        boxShadow: "0 2px 6px rgba(217,30,24,0.3)",
                      }}>{filtered.length}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to="/crm-enquiry/add" className="btn btn-sm btn-primary">
                        <i className="bx bx-plus me-1"></i> Add Enquiry
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row mb-3 g-2 align-items-center">
                    <div className="col-auto d-flex align-items-center gap-2">
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
                      <select className="form-select form-select-sm" style={{ width: 70 }} value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                        {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>entries</span>
                    </div>
                    <div className="col-sm-12 col-md-5">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by reference Id, name, phone, place or assigned to..."
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                          }}
                        />
                        <i
                          className="bx bx-search position-absolute"
                          style={{
                            top: "50%",
                            right: "12px",
                            transform: "translateY(-50%)",
                            color: "#adb5bd",
                          }}
                        ></i>
                      </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                      <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="ALL">All Status</option>
                        <option value="NEW">New</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="CONVERTED_TO_LEAD">Converted To Lead</option>
                        <option value="HOLD">Hold</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-sm-6 col-md-2">
                      <select
                        className="form-select"
                        value={leadSourceFilter}
                        onChange={(e) => {
                          setLeadSourceFilter(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="ALL">All Lead Sources</option>
                        <option value="WEBSITE">Website</option>
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="FACEBOOK">Facebook</option>
                        <option value="REFERENCE">Reference</option>
                        <option value="WALK_IN">Walk In</option>
                      </select>
                    </div>

                    <div className="col-md-2 text-end d-flex align-items-center justify-content-md-end">
                      <span className="text-muted font-size-13">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                      </span>
                    </div>
                  </div>

                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "70px" }}>S.No</th>
                          <th>Reference ID</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Place</th>
                          <th>Interested Package</th>
                          <th>Lead Source</th>
                          <th>Status</th>
                          <th>Follow-up Date</th>
                          <th>Assigned To</th>
                          <th>Created Date</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paged.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="text-center py-5 text-muted">
                              <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                              No enquiry records found.
                            </td>
                          </tr>
                        ) : (
                          paged.map((row, index) => (
                            <tr key={row._id} className={selected.includes(row._id) ? "table-active" : ""}>
                              <td>{(page - 1) * perPage + index + 1}</td>
                              <td>{row.referenceId}</td>
                              <td>{row.name}</td>
                              <td>{row.phone}</td>
                              <td>{row.place}</td>
                              <td>{row.interestedPackage?.packageName}</td>
                              <td>{leadSourceBadge(row.leadSource?.leadSourceName)}</td>
                              <td>{statusBadge(row.status)}</td>
                              <td>
                                {row.followUpDate
                                  ? new Date(row.followUpDate).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td>{row.assignedTo}</td>
                              <td>{new Date(row.createdAt).toLocaleDateString()}</td>

                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  <Link
                                    to={`/crm-enquiry/edit/${row._id}`}
                                    state={{ rowData: row }}
                                    className="ckz-action-btn ckz-action-edit"
                                    title="Edit"
                                  >
                                    <i className="bx bx-edit-alt"></i>
                                  </Link>

                                  {row.status !== "CONVERTED_TO_LEAD" && (
                                    <button
                                      className="ckz-action-btn ckz-action-convert"
                                      title="Convert To Lead"
                                      onClick={() => confirmConvert(row._id)}
                                    >
                                      <i className="bx bx-transfer-alt"></i>
                                    </button>
                                  )}

                                  <button
                                    className="ckz-action-btn ckz-action-delete"
                                    title="Delete"
                                    onClick={() => confirmDelete(row._id)}
                                  >
                                    <i className="bx bx-trash-alt"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                      <div className="text-muted font-size-13">
                        Showing {(page - 1) * perPage + 1} –{" "}
                        {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                      </div>

                      <ul className="pagination pagination-rounded mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                            <i className="bx bx-chevron-left"></i>
                          </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(p)}>
                              {p}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                            <i className="bx bx-chevron-right"></i>
                          </button>
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

      {/* ── Delete Modal ── */}
      {showDeleteModal && (() => {
        const rec = enquiries.find(e => e._id === deleteId);
        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(15,15,15,0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
            animation: "fadeIn 0.18s ease",
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: "40px 32px 32px",
              maxWidth: 420, width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)",
              animation: "scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              textAlign: "center",
              position: "relative",
            }}>
              {/* Close */}
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#f3f4f6", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#9ca3af", fontSize: 20, lineHeight: 1,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <i className="bx bx-x" />
              </button>

              {/* Icon with pulse rings */}
              <div style={{ position: "relative", display: "inline-flex", marginBottom: 22 }}>
                <div style={{
                  position: "absolute", inset: -10, borderRadius: "50%",
                  border: "1.5px solid rgba(217,30,24,0.15)",
                  animation: "pulseDot 2.2s ease infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -20, borderRadius: "50%",
                  border: "1px solid rgba(217,30,24,0.07)",
                }} />
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #D91E18 0%, #991B1B 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 10px 28px rgba(217,30,24,0.38)",
                }}>
                  <i className="bx bx-trash" style={{ color: "#fff", fontSize: 32 }} />
                </div>
              </div>

              <h4 style={{ fontWeight: 800, fontSize: 20, color: "#1A1A1A", margin: "0 0 10px" }}>
                Delete Enquiry?
              </h4>

              {rec && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(217,30,24,0.05)",
                  border: "1px solid rgba(217,30,24,0.12)",
                  borderRadius: 10, padding: "6px 14px",
                  marginBottom: 14,
                }}>
                  <span style={{ fontWeight: 800, color: "#D91E18", fontSize: 12.5 }}>#{rec.referenceId}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }} />
                  <span style={{ color: "#374151", fontSize: 12.5, fontWeight: 600 }}>{rec.name}</span>
                </div>
              )}

              <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: "0 0 28px" }}>
                This record will be <span style={{ color: "#D91E18", fontWeight: 700 }}>permanently removed</span>.
                This action cannot be undone.
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 12,
                    border: "1.5px solid #e5e7eb",
                    background: "#f9fafb", color: "#374151",
                    fontWeight: 600, fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "linear-gradient(135deg, rgba(217,30,24,0.92) 0%, rgba(153,27,27,0.96) 100%)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    cursor: deleting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 20px rgba(217,30,24,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "all 0.15s ease",
                    opacity: deleting ? 0.82 : 1,
                  }}
                  onMouseEnter={e => { if (!deleting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(217,30,24,0.56), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(217,30,24,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"; }}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: 15, height: 15, borderWidth: 2 }} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-trash" style={{ fontSize: 17 }} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Convert to Lead Modal ── */}
      {showConvertModal && (() => {
        const rec = enquiries.find(e => e._id === convertId);
        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(15,15,15,0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
            animation: "fadeIn 0.18s ease",
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: "40px 32px 32px",
              maxWidth: 420, width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)",
              animation: "scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              textAlign: "center",
              position: "relative",
            }}>
              {/* Close */}
              <button
                onClick={() => setShowConvertModal(false)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#f3f4f6", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#9ca3af", fontSize: 20, lineHeight: 1,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <i className="bx bx-x" />
              </button>

              {/* Icon with pulse rings */}
              <div style={{ position: "relative", display: "inline-flex", marginBottom: 22 }}>
                <div style={{
                  position: "absolute", inset: -10, borderRadius: "50%",
                  border: "1.5px solid rgba(5,150,105,0.18)",
                  animation: "pulseDot 2.2s ease infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -20, borderRadius: "50%",
                  border: "1px solid rgba(5,150,105,0.08)",
                }} />
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 10px 28px rgba(5,150,105,0.38)",
                }}>
                  <i className="bx bx-transfer-alt" style={{ color: "#fff", fontSize: 32 }} />
                </div>
              </div>

              <h4 style={{ fontWeight: 800, fontSize: 20, color: "#1A1A1A", margin: "0 0 10px" }}>
                Convert to Lead?
              </h4>

              {rec && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(5,150,105,0.05)",
                  border: "1px solid rgba(5,150,105,0.15)",
                  borderRadius: 10, padding: "6px 14px",
                  marginBottom: 14,
                }}>
                  <span style={{ fontWeight: 800, color: "#059669", fontSize: 12.5 }}>#{rec.referenceId}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }} />
                  <span style={{ color: "#374151", fontSize: 12.5, fontWeight: 600 }}>{rec.name}</span>
                </div>
              )}

              <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: "0 0 18px" }}>
                This enquiry will be moved to the{" "}
                <span style={{ color: "#059669", fontWeight: 700 }}>Leads module</span>.
                The original record's status will update to <em>Converted</em>.
              </p>

              {/* Info row */}
              <div style={{
                display: "flex", justifyContent: "center", gap: 20,
                background: "#f0fdf4", borderRadius: 12,
                padding: "10px 16px", marginBottom: 24,
              }}>
                {[
                  { icon: "bx-check-circle", text: "Lead created" },
                  { icon: "bx-link-alt",     text: "Enquiry linked" },
                  { icon: "bx-lock-alt",     text: "Status locked" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#059669", fontWeight: 600 }}>
                    <i className={`bx ${icon}`} style={{ fontSize: 15 }} />
                    {text}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowConvertModal(false)}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 12,
                    border: "1.5px solid #e5e7eb",
                    background: "#f9fafb", color: "#374151",
                    fontWeight: 600, fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvertLead}
                  disabled={converting}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "linear-gradient(135deg, rgba(5,150,105,0.92) 0%, rgba(4,120,87,0.96) 100%)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    cursor: converting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 20px rgba(5,150,105,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "all 0.15s ease",
                    opacity: converting ? 0.82 : 1,
                  }}
                  onMouseEnter={e => { if (!converting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(5,150,105,0.56), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(5,150,105,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"; }}
                >
                  {converting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: 15, height: 15, borderWidth: 2 }} />
                      Converting...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-transfer-alt" style={{ fontSize: 17 }} />
                      Convert to Lead
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </React.Fragment>
  );
};

export default Enquiry;