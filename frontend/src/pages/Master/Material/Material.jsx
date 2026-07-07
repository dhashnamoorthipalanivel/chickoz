import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMaterials } from "../../../store/store";
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

const Material = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { materials, fetchMaterials, deleteMaterial } = useMaterials();
  useEffect(() => { fetchMaterials(); }, []);

  const filtered = materials.filter(item =>
    (item.materialName?.toLowerCase().includes(search.toLowerCase()) || item.category?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || item.status === statusFilter) &&
    (categoryFilter === "ALL" || item.category === categoryFilter)
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page-1)*perPage, page*perPage);

  const confirmDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMaterial(deleteId); await fetchMaterials();
      toast.success("Material deleted"); setShowDeleteModal(false); setDeleteId(null);
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
                <i className="bx bx-box" style={{ color:"#fff", fontSize:22 }}/>
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight:800, fontSize:18, color:"#1A1A1A" }}>Material Management</h4>
                <div style={{ fontSize:12, color:"#F97316", fontWeight:600, marginTop:1 }}>Masters · Material</div>
              </div>
            </div>
            <ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li><li className="breadcrumb-item active">Material</li></ol>
          </div>
        </div></div>

        <div className="row"><div className="col-12"><div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <h4 className="card-title mb-0">Material Records</h4>
                <span style={{ background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:700, boxShadow:"0 2px 6px rgba(217,30,24,0.3)" }}>{filtered.length}</span>
              </div>
              <Link to="/master-material/add" className="btn btn-sm btn-primary"><i className="bx bx-plus me-1"/>Add Material</Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3 g-2 align-items-center">
              <div className="col-auto d-flex align-items-center gap-2">
                <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap" }}>Show</span>
                <select className="form-select form-select-sm" style={{ width:70 }} value={perPage} onChange={e=>{setPerPage(Number(e.target.value));setPage(1);}}>{[5,10,25,50].map(n=><option key={n} value={n}>{n}</option>)}</select>
                <span style={{ fontSize:13, color:"#6b7280", whiteSpace:"nowrap" }}>entries</span>
              </div>
              <div className="col-sm-12 col-md-4">
                <div className="position-relative">
                  <input type="text" className="form-control" placeholder="Search by name, code or category..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
                  <i className="bx bx-search position-absolute" style={{ top:"50%", right:12, transform:"translateY(-50%)", color:"#adb5bd" }}/>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <select className="form-select" value={categoryFilter} onChange={e=>{setCategoryFilter(e.target.value);setPage(1);}}>
                  <option value="ALL">All Categories</option>
                  {["EQUIPMENT","UTENSIL","UNIFORM","ACCESSORY","STATIONERY","FURNITURE"].map(c=><option key={c} value={c}>{formatLabel(c)}</option>)}
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
                    <th style={{ width:60 }}>S.No</th>
                    <th>Material Name</th>
                    <th>Category</th>
                    <th>Power Type</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? <tr><td colSpan="8" className="text-center py-5 text-muted"><i className="bx bx-search-alt display-4 d-block mb-2"/>No material records found.</td></tr>
                  : paged.map((row, i) => (
                    <tr key={row._id}>
                      <td>{(page-1)*perPage+i+1}</td>
                      <td style={{ fontWeight:600 }}>{row.materialName}</td>
                      <td><span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#2563eb", background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.2)", whiteSpace:"nowrap" }}>{formatLabel(row.category)}</span></td>
                      <td><span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, color:"#6b7280", background:"#f3f4f6", border:"1px solid #e5e7eb", whiteSpace:"nowrap" }}>{formatLabel(row.powerType)}</span></td>
                      <td><span style={{ fontWeight:700 }}>{row.quantity}</span></td>
                      <td>{row.unit}</td>
                      <td>{statusPill(row.status)}</td>
                      <td><div className="d-flex justify-content-center gap-2">
                        <Link to={`/master-material/edit/${row._id}`} state={{ rowData:row }} className="ckz-action-btn ckz-action-edit" title="Edit"><i className="bx bx-edit-alt"/></Link>
                        <button className="ckz-action-btn ckz-action-delete" title="Delete" onClick={()=>confirmDelete(row._id)}><i className="bx bx-trash-alt"/></button>
                      </div></td>
                    </tr>
                  ))}
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

export default Material;
