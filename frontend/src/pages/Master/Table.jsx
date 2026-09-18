import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTables, createTable, updateTable, deleteTable } from "../../api/tableApi";
import { useAuthStore } from "../../store/store";

const formatLabel = (v) => {
  if (!v) return "";
  return v.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

const statusPill = (status) => {
  const s = status === "ACTIVE"
    ? { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.2)" }
    : { color: "#D91E18", bg: "rgba(217,30,24,0.08)", border: "rgba(217,30,24,0.18)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, color: s.color, background: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {formatLabel(status)}
    </span>
  );
};

const DeleteModal = ({ onClose, onConfirm, deleting }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,15,15,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px 32px", maxWidth: 420, width: "100%", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", textAlign: "center", position: "relative" }}>
      <h4 style={{ fontWeight: 800, fontSize: 20, color: "#1A1A1A", margin: "0 0 10px" }}>Delete Table?</h4>
      <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: "0 0 28px" }}>This table will be permanently removed.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        <button onClick={onConfirm} disabled={deleting} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1px solid rgba(255,255,255,0.22)", background: "linear-gradient(135deg,rgba(217,30,24,0.92) 0%,rgba(153,27,27,0.96) 100%)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: deleting ? "not-allowed" : "pointer" }}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

const FormModal = ({ isOpen, onClose, onSubmit, editData, saving }) => {
  const [formData, setFormData] = useState({ tableName: "", seatingCapacity: 4, status: "ACTIVE" });

  useEffect(() => {
    if (editData) {
      setFormData({
        tableName: editData.tableName || "",
        seatingCapacity: editData.seatingCapacity || 4,
        status: editData.status || "ACTIVE"
      });
    } else {
      setFormData({ tableName: "", seatingCapacity: 4, status: "ACTIVE" });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,15,15,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "30px", maxWidth: 500, width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px", fontWeight: 700, fontSize: 20 }}>{editData ? "Edit Table" : "Create New Table"}</h3>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Table Name *</label>
          <input type="text" value={formData.tableName} onChange={e => setFormData({ ...formData, tableName: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} placeholder="e.g. Table 1" />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Seating Capacity (Chairs) *</label>
          <input type="number" min="1" value={formData.seatingCapacity} onChange={e => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) || 1 })} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} placeholder="4" />
        </div>

        <div style={{ marginBottom: 25 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Status</label>
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, background: "#fff" }}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 600, cursor: "pointer", color: "#374151" }}>Cancel</button>
          <button onClick={() => onSubmit(formData)} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#D91E18", color: "#fff", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Save Table"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TableMaster = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const { franchise, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const fid = franchise?._id || franchise?.franchise?._id;
      const data = await getTables(fid);
      if (Array.isArray(data)) {
        setTables(data);
      } else {
        setTables([]);
        console.error("Backend returned non-array data:", data);
      }
    } catch (err) {
      toast.error("Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [franchise]);

  const handleSave = async (data) => {
    if (!data.tableName.trim()) return toast.error("Table name is required");
    try {
      setActionLoading(true);
      const fid = franchise?._id || franchise?.franchise?._id;
      if (editItem) {
        await updateTable(editItem._id, { ...data, franchiseId: fid });
        toast.success("Table updated successfully");
      } else {
        await createTable({ ...data, franchiseId: fid });
        toast.success("Table created successfully");
      }
      setShowModal(false);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteTable(deleteId);
      toast.success("Table deleted successfully");
      setShowDelete(false);
      fetchTables();
    } catch (err) {
      toast.error("Failed to delete table");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {/* Title Box */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow: "0 4px 14px rgba(217,30,24,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-table" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Table Master</h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>Manage tables and seating capacity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <h4 className="card-title mb-0">Table Records</h4>
                    <button 
                      onClick={() => { setEditItem(null); setShowModal(true); }}
                      className="btn btn-sm btn-primary"
                      style={{ background: "#D91E18", borderColor: "#D91E18" }}
                    >
                      <i className="bx bx-plus me-1" /> Add Table
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                  {loading ? (
                    <div className="text-center p-4 text-muted">Loading...</div>
                  ) : tables.length === 0 ? (
                    <div className="text-center p-5 text-muted">No tables found. Create one!</div>
                  ) : (
                    <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                      <thead className="table-light">
                <tr>
                  <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 }}>Table Name</th>
                  <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 }}>Capacity (Chairs)</th>
                  <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 }}>Status</th>
                  <th style={{ padding: "14px 24px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 }}>Actions</th>
                </tr>
              </thead>
                      <tbody>
                        {tables.map(table => (
                          <tr key={table._id}>
                            <td style={{ fontWeight: 600 }}>{table.tableName}</td>
                            <td>{table.seatingCapacity} Chairs</td>
                            <td>{statusPill(table.status)}</td>
                            <td className="text-end">
                              <button onClick={() => { setEditItem(table); setShowModal(true); }} className="btn btn-sm btn-soft-primary me-2"><i className="bx bx-edit-alt" /></button>
                              <button onClick={() => { setDeleteId(table._id); setShowDelete(true); }} className="btn btn-sm btn-soft-danger"><i className="bx bx-trash" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleSave} editData={editItem} saving={actionLoading} />
      {showDelete && <DeleteModal onClose={() => setShowDelete(false)} onConfirm={handleDelete} deleting={actionLoading} />}
    </React.Fragment>
  );
};

export default TableMaster;