import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePackageStore } from "../../../store/store";
import { toast } from "react-toastify";

const formatLabel = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const statusPill = (status) => {
  const s = status === "ACTIVE"
    ? { color:"#059669", bg:"rgba(5,150,105,0.08)", border:"rgba(5,150,105,0.2)" }
    : { color:"#D91E18", bg:"rgba(217,30,24,0.08)", border:"rgba(217,30,24,0.18)" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, fontSize:11.5, fontWeight:700, letterSpacing:0.3, color:s.color, background:s.bg, border:`1px solid ${s.border}`, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.color, flexShrink:0 }}/>{formatLabel(status)}
    </span>
  );
};

const packageTypePill = (type) => {
  const map = {
    GAS:        { color:"#F97316", bg:"rgba(249,115,22,0.09)", border:"rgba(249,115,22,0.25)", icon:"bx-flame" },
    ELECTRICAL: { color:"#2563eb", bg:"rgba(37,99,235,0.08)",  border:"rgba(37,99,235,0.22)",  icon:"bx-bolt-circle" },
    BOTH:       { color:"#7c3aed", bg:"rgba(124,58,237,0.08)", border:"rgba(124,58,237,0.22)", icon:"bx-transfer" },
  };
  const s = map[type] || { color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb", icon:"bx-box" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, fontSize:11.5, fontWeight:700, color:s.color, background:s.bg, border:`1px solid ${s.border}`, whiteSpace:"nowrap" }}>
      <i className={`bx ${s.icon}`} style={{ fontSize:13 }}/>{formatLabel(type)}
    </span>
  );
};

const royaltyCell = (type, value) => {
  if (!type || type === "NO_ROYALTY") {
    return <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#9ca3af", background:"#f9fafb", border:"1px solid #e5e7eb", whiteSpace:"nowrap" }}>No Royalty</span>;
  }
  if (type === "PERCENTAGE") {
    return <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#2563eb", background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.2)", whiteSpace:"nowrap" }}><i className="bx bx-percentage" style={{ fontSize:13 }}/>{value}%</span>;
  }
  return <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#d97706", background:"rgba(217,119,6,0.08)", border:"1px solid rgba(217,119,6,0.2)", whiteSpace:"nowrap" }}>₹{value?.toLocaleString()}</span>;
};

const DeleteModal = ({ onClose, onConfirm, deleting }) => (
  <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(15,15,15,0.65)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"fadeIn 0.18s ease" }}>
    <div style={{ background:"#fff", borderRadius:24, padding:"40px 32px 32px", maxWidth:420, width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,0.22)", animation:"scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)", textAlign:"center", position:"relative" }}>
      <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:32, height:32, borderRadius:"50%", background:"#f3f4f6", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#9ca3af", fontSize:20 }} onMouseEnter={e=>{e.currentTarget.style.background="#e5e7eb"}} onMouseLeave={e=>{e.currentTarget.style.background="#f3f4f6"}}><i className="bx bx-x"/></button>
      <div style={{ position:"relative", display:"inline-flex", marginBottom:22 }}>
        <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:"1.5px solid rgba(217,30,24,0.15)", animation:"pulseDot 2.2s ease infinite" }}/>
        <div style={{ position:"absolute", inset:-20, borderRadius:"50%", border:"1px solid rgba(217,30,24,0.07)" }}/>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#D91E18 0%,#991B1B 100%)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 28px rgba(217,30,24,0.38)" }}>
          <i className="bx bx-trash" style={{ color:"#fff", fontSize:32 }}/>
        </div>
      </div>
      <h4 style={{ fontWeight:800, fontSize:20, color:"#1A1A1A", margin:"0 0 10px" }}>Delete Record?</h4>
      <p style={{ color:"#6b7280", fontSize:13.5, lineHeight:1.65, margin:"0 0 28px" }}>This record will be <span style={{ color:"#D91E18", fontWeight:700 }}>permanently removed</span>. This action cannot be undone.</p>
      <div style={{ display:"flex", gap:12 }}>
        <button onClick={onClose} style={{ flex:1, padding:"13px 0", borderRadius:12, border:"1.5px solid #e5e7eb", background:"#f9fafb", color:"#374151", fontWeight:600, fontSize:14, cursor:"pointer" }} onMouseEnter={e=>{e.currentTarget.style.background="#f3f4f6"}} onMouseLeave={e=>{e.currentTarget.style.background="#f9fafb"}}>Cancel</button>
        <button onClick={onConfirm} disabled={deleting} style={{ flex:1, padding:"13px 0", borderRadius:12, border:"none", background:"linear-gradient(135deg,rgba(217,30,24,0.92) 0%,rgba(153,27,27,0.96) 100%)", color:"#fff", fontWeight:700, fontSize:14, cursor:deleting?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, opacity:deleting?0.82:1 }} onMouseEnter={e=>{if(!deleting)e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
          {deleting?<><span className="spinner-border spinner-border-sm" style={{ width:15, height:15, borderWidth:2 }}/> Deleting...</>:<><i className="bx bx-trash" style={{ fontSize:17 }}/> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

const Package = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [packageTypeFilter, setPackageTypeFilter] = useState("ALL");
  const [royaltyTypeFilter, setRoyaltyTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { packages, fetchPackages, deletePackage } = usePackageStore();
  useEffect(() => { fetchPackages(); }, []);

  const filtered = packages.filter(item =>
    (item.packageName?.toLowerCase().includes(search.toLowerCase()) ||
     item.packageType?.toLowerCase().includes(search.toLowerCase()) ||
     item.agreementDuration?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || item.status === statusFilter) &&
    (packageTypeFilter === "ALL" || item.packageType === packageTypeFilter) &&
    (royaltyTypeFilter === "ALL" || item.royaltyType === royaltyTypeFilter)
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page-1)*perPage, page*perPage);

  const confirmDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePackage(deleteId); await fetchPackages();
      toast.success("Package deleted"); setShowDeleteModal(false); setDeleteId(null);
    } catch (e) { toast.error(e?.response?.data?.message || "Failed to delete"); }
    finally { setDeleting(false); }
  };

  return (
    <React.Fragment>
      <div className="page-content"><div className="container-fluid">
        <div className="row"><div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow:"0 4px 14px rgba(217,30,24,0.32)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="bx bx-package" style={{ color:"#fff", fontSize:22 }}/>
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight:800, fontSize:18, color:"#1A1A1A" }}>Package Management</h4>
                <div style={{ fontSize:12, color:"#F97316", fontWeight:600, marginTop:1 }}>Masters · Package</div>
              </div>
            </div>
            <ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li><li className="breadcrumb-item active">Package</li></ol>
          </div>
        </div></div>

        <div className="row"><div className="col-12"><div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <h4 className="card-title mb-0">Package Records</h4>
                <span style={{ background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:700, boxShadow:"0 2px 6px rgba(217,30,24,0.3)" }}>{filtered.length}</span>
              </div>
              <Link to="/master-package/add" className="btn btn-sm btn-primary"><i className="bx bx-plus me-1"/>Add Package</Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3 g-2 align-items-center">
              <div className="col-auto d-flex align-items-center gap-2">
                <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap" }}>Show</span>
                <select className="form-select form-select-sm" style={{ width:70 }} value={perPage} onChange={e=>{setPerPage(Number(e.target.value));setPage(1);}}>{[5,10,25,50].map(n=><option key={n} value={n}>{n}</option>)}</select>
                <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap" }}>entries</span>
              </div>
              <div className="col-sm-12 col-md-3">
                <div className="position-relative">
                  <input type="text" className="form-control" placeholder="Search by name, type or duration..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
                  <i className="bx bx-search position-absolute" style={{ top:"50%", right:12, transform:"translateY(-50%)", color:"#adb5bd" }}/>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={packageTypeFilter} onChange={e=>{setPackageTypeFilter(e.target.value);setPage(1);}}>
                  <option value="ALL">All Types</option>
                  <option value="GAS">Gas</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={royaltyTypeFilter} onChange={e=>{setRoyaltyTypeFilter(e.target.value);setPage(1);}}>
                  <option value="ALL">All Royalty</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed</option>
                  <option value="NO_ROYALTY">No Royalty</option>
                </select>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="col text-end"><span className="text-muted font-size-13">{filtered.length} result{filtered.length!==1?"s":""} found</span></div>
            </div>

            <div className="table-responsive" style={{ overflowX:"auto" }}>
              <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th style={{ width:50 }}>S.No</th>
                    <th>Package Name</th>
                    <th>Type</th>
                    <th>Cart Size</th>
                    <th>Cart Amount</th>
                    <th>Price</th>
                    <th>Advance</th>
                    <th>Royalty</th>
                    <th>Menu Items</th>
                    <th>Total Amount</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0
                    ? <tr><td colSpan="13" className="text-center py-5 text-muted"><i className="bx bx-search-alt display-4 d-block mb-2"/>No package records found.</td></tr>
                    : paged.map((row, i) => {
                        const menuCount = row.packageMenuItems?.length || 0;
                        return (
                          <tr key={row._id}>
                            <td>{(page-1)*perPage+i+1}</td>
                            <td style={{ maxWidth:200 }}>
                              <div style={{ fontWeight:700, fontSize:13.5, color:"#1A1A1A" }}>{row.packageName}</div>
                              {row.features && <div style={{ fontSize:11.5, color:"#9ca3af", marginTop:2, maxWidth:190, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.features}</div>}
                            </td>
                            <td>{packageTypePill(row.packageType)}</td>
                            <td><span style={{ fontWeight:600, color:"#374151" }}>{row.cartSize || "—"}</span></td>
                            <td><span style={{ fontWeight:700, color:"#1A1A1A" }}>₹{row.cartAmount?.toLocaleString() ?? "—"}</span></td>
                            <td><span style={{ fontWeight:700, color:"#1A1A1A" }}>₹{row.price?.toLocaleString() ?? "—"}</span></td>
                            <td><span style={{ fontWeight:600, color:"#374151" }}>₹{row.advanceAmount?.toLocaleString() ?? "—"}</span></td>
                            <td>{royaltyCell(row.royaltyType, row.royaltyValue)}</td>
                            <td>
                              <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:menuCount > 0 ? "#F97316" : "#9ca3af", background:menuCount > 0 ? "rgba(249,115,22,0.08)" : "#f9fafb", border:`1px solid ${menuCount > 0 ? "rgba(249,115,22,0.22)" : "#e5e7eb"}`, whiteSpace:"nowrap" }}>
                                <i className="bx bx-food-menu" style={{ fontSize:13 }}/>{menuCount} item{menuCount !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight:800, color:row.totalAmount > 0 ? "#059669" : "#1A1A1A" }}>₹{row.totalAmount?.toLocaleString() ?? "—"}</div>
                              {row.isTaxApplicable && row.taxPercentage > 0 && <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>incl. {row.taxPercentage}% GST</div>}
                            </td>
                            <td><span style={{ fontWeight:600, color:"#374151" }}>{row.agreementDuration || "—"}</span></td>
                            <td>{statusPill(row.status)}</td>
                            <td><div className="d-flex justify-content-center gap-2">
                              <Link to={`/master-package/edit/${row._id}`} state={{ rowData:row }} className="ckz-action-btn ckz-action-edit" title="Edit"><i className="bx bx-edit-alt"/></Link>
                              <button className="ckz-action-btn ckz-action-delete" title="Delete" onClick={()=>confirmDelete(row._id)}><i className="bx bx-trash-alt"/></button>
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
                <div className="text-muted font-size-13">Showing {(page-1)*perPage+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length} entries</div>
                <ul className="pagination pagination-rounded mb-0">
                  <li className={`page-item ${page===1?"disabled":""}`}><button className="page-link" onClick={()=>setPage(p=>p-1)}><i className="bx bx-chevron-left"/></button></li>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p=><li key={p} className={`page-item ${page===p?"active":""}`}><button className="page-link" onClick={()=>setPage(p)}>{p}</button></li>)}
                  <li className={`page-item ${page===totalPages?"disabled":""}`}><button className="page-link" onClick={()=>setPage(p=>p+1)}><i className="bx bx-chevron-right"/></button></li>
                </ul>
              </div>
            )}
          </div>
        </div></div></div>
      </div></div>
      {showDeleteModal && <DeleteModal onClose={()=>{setShowDeleteModal(false);setDeleteId(null);}} onConfirm={handleDelete} deleting={deleting}/>}
    </React.Fragment>
  );
};

export default Package;
