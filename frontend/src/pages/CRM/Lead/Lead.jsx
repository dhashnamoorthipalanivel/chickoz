import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeadStore } from "../../../store/store";

const STAGES = ["SITE_VISIT", "APPROVAL", "TRAINING", "PAYMENT", "FINAL_SETUP"];

const formatLabel = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const getCompletedStages = (stagesObj) => {
  const completed = [];
  if (stagesObj?.SITE_VISIT?.data?.visitType && stagesObj?.SITE_VISIT?.data?.visitDate && stagesObj?.SITE_VISIT?.data?.location)
    completed.push("SITE_VISIT");
  if (stagesObj?.APPROVAL?.data?.siteStatus === "Approved" && stagesObj?.APPROVAL?.data?.approvalStatus === "Approved" && stagesObj?.APPROVAL?.data?.legalStatus === "Completed")
    completed.push("APPROVAL");
  if (stagesObj?.TRAINING?.data?.trainingStatus === "Completed")
    completed.push("TRAINING");
  const total = Number(stagesObj?.PAYMENT?.data?.totalAmount || 0);
  const paid = (stagesObj?.PAYMENT?.data?.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
  if (total > 0 && paid >= total) completed.push("PAYMENT");
  if (stagesObj?.FINAL_SETUP?.data?.contractSigned === "Yes") completed.push("FINAL_SETUP");
  return completed;
};

const getLeadStatus = (completedStages) => {
  if (completedStages.length === 0) return "NOT_STARTED";
  if (completedStages.length === STAGES.length) return "COMPLETED";
  return "IN_PROGRESS";
};

const LEAD_STATUS_STYLE = {
  NOT_STARTED: { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
  IN_PROGRESS: { color: "#2563EB", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.18)" },
  COMPLETED: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.18)" },
  HOLD: { color: "#D97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.2)" },
  CANCELLED: { color: "#991B1B", bg: "rgba(153,27,27,0.08)", border: "rgba(153,27,27,0.18)" },
  RETURN: { color: "#0891B2", bg: "rgba(8,145,178,0.08)", border: "rgba(8,145,178,0.18)" },
};

const STAGE_STYLE = {
  SITE_VISIT: { color: "#2563EB", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.18)" },
  APPROVAL: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.18)" },
  TRAINING: { color: "#D97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.2)" },
  PAYMENT: { color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.18)" },
  FINAL_SETUP: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.18)" },
  COMPLETED: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.18)" },
};

const statusPill = (status) => {
  const s = LEAD_STATUS_STYLE[status] || LEAD_STATUS_STYLE.NOT_STARTED;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, color: s.color, background: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />{formatLabel(status)}
    </span>
  );
};

const stagePill = (stage) => {
  const s = STAGE_STYLE[stage] || { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {formatLabel(stage)}
    </span>
  );
};

const Lead = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { leads, fetchLeads } = useLeadStore();
  useEffect(() => { fetchLeads(); }, []);

  const filtered = leads.filter(row => {
    const matchSearch =
      (row.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.referenceId || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.phone || "").includes(search);
    const completedStages = getCompletedStages(row.stages);
    const leadStatus = row.leadStatus === "NEW" ? getLeadStatus(completedStages) : (row.leadStatus || "NOT_STARTED");
    const matchStatus = statusFilter === "ALL" || leadStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content"><div className="container-fluid">
        <div className="row"><div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bx bx-trending-up" style={{ color: "#fff", fontSize: 22 }} />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Lead Management</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>CRM · Leads</div>
              </div>
            </div>
            <ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li><li className="breadcrumb-item active">Leads</li></ol>
          </div>
        </div></div>

        <div className="row"><div className="col-12"><div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h4 className="card-title mb-0">Lead Records</h4>
                <span style={{ background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", color: "#fff", borderRadius: 10, padding: "2px 9px", fontSize: 11, fontWeight: 700, boxShadow: "0 2px 6px rgba(37,99,235,0.3)" }}>{filtered.length}</span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3 g-2 align-items-center">
              <div className="col-auto d-flex align-items-center gap-2">
                <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
                <select className="form-select form-select-sm" style={{ width: 70 }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>{[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}</select>
                <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>entries</span>
              </div>
              <div className="col-sm-12 col-md-4">
                <div className="position-relative">
                  <input type="text" className="form-control" placeholder="Search by name, ref ID or phone..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                  <i className="bx bx-search position-absolute" style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: "#adb5bd" }} />
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                  <option value="ALL">All Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="HOLD">Hold</option>
                  <option value="RETURN">Return</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="col text-end"><span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</span></div>
            </div>

            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 50 }}>S.No</th>
                    <th>Reference ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Place</th>
                    <th>Current Stage</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Assigned To</th>
                    <th>Created Date</th>
                    <th className="text-center" style={{ position: "sticky", right: 0, zIndex: 2, background: "#f8f9fa", boxShadow: "-1px 0 0 #eff2f7" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0
                    ? <tr><td colSpan="11" className="text-center py-5 text-muted"><i className="bx bx-search-alt display-4 d-block mb-2" />No lead records found.</td></tr>
                    : paged.map((row, i) => {
                      const completedStages = getCompletedStages(row.stages);
                      const leadStatus = row.leadStatus === "NEW"
                        ? getLeadStatus(completedStages)
                        : (row.leadStatus || "NOT_STARTED");
                      const currentStage =
                        completedStages.length === 0 ? "SITE_VISIT"
                          : completedStages.length === STAGES.length ? "COMPLETED"
                            : STAGES[completedStages.length];
                      const progress = Math.round((completedStages.length / STAGES.length) * 100);
                      return (
                        <tr key={row._id}>
                          <td>{(page - 1) * perPage + i + 1}</td>
                          <td><span style={{ fontWeight: 700, color: "#2563EB", fontSize: 12.5 }}>{row.referenceId}</span></td>
                          <td style={{ fontWeight: 600 }}>{row.name}</td>
                          <td>{row.phone}</td>
                          <td>{row.place}</td>
                          <td>{stagePill(currentStage)}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {statusPill(leadStatus)}
                              {row.isFranchiseCreated && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
                                  <i className="bx bx-store" style={{ fontSize: 11 }} /> Franchise
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ minWidth: 130 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, height: 6, borderRadius: 99, background: "#f3f4f6", overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: 99, width: `${progress}%`, background: progress === 100 ? "#059669" : progress > 0 ? "linear-gradient(90deg,#2563EB,#7C3AED)" : "#e5e7eb", transition: "width 0.4s ease" }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", minWidth: 28 }}>{progress}%</span>
                            </div>
                          </td>
                          <td>{row.assignedTo}</td>
                          <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                          <td style={{ position: "sticky", right: 0, zIndex: 1, background: "#fff", boxShadow: "-1px 0 0 #eff2f7" }}>
                            <div className="d-flex justify-content-center gap-2" >
                              <Link to={`/crm-lead/view/${row._id}`} className="ckz-action-btn ckz-action-view" title="View"><i className="bx bx-show" /></Link>
                              <Link to={`/crm-lead/${row._id}`} className="ckz-action-btn ckz-action-convert" title="Open Stages"><i className="bx bx-folder-open" /></Link>
                            </div></td>
                        </tr>
                      );
                    })
                  }
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
      </div></div>
    </React.Fragment>
  );
};

export default Lead;
