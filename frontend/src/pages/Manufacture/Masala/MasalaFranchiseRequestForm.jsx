import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMasalaItems, useMasalaRequestStore, usePaymentModes } from "../../../store/store";

const SectionHeader = ({ icon, title, badge }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:14, borderBottom:"1.5px solid #f3f4f6" }}>
    <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,rgba(217,30,24,0.12) 0%,rgba(249,115,22,0.08) 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <i className={`bx ${icon}`} style={{ color:"#D91E18", fontSize:17 }}/>
    </div>
    <div style={{ fontWeight:700, fontSize:14.5, color:"#1A1A1A" }}>{title}</div>
    {badge != null && (
      <span style={{ background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:700, marginLeft:"auto" }}>{badge}</span>
    )}
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label style={{ fontSize:12.5, fontWeight:600, color:"#374151", marginBottom:5, display:"block" }}>
    {children}{required && <span style={{ color:"#D91E18", marginLeft:3 }}>*</span>}
  </label>
);

const inputStyle = { borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:13.5, padding:"9px 13px", color:"#1A1A1A", background:"#fff", width:"100%", outline:"none", transition:"border-color 0.15s" };
const readonlyStyle = { ...inputStyle, background:"#f9fafb", color:"#9ca3af", cursor:"not-allowed" };

const MasalaFranchiseRequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { masalaItems, fetchMasalaItems } = useMasalaItems();
  const { createRequest, editRequest, loading } = useMasalaRequestStore();
  const { paymentModes, fetchPaymentModes } = usePaymentModes();

  const editData = state?.rowData;
  const isEdit = !!id;

  useEffect(() => {
    fetchMasalaItems();
    fetchPaymentModes();
  }, []);

  const [formData, setFormData] = useState({
    requestId: "",
    orderDate: "",
    requiredDate: "",
    priority: "",
    paymentOption: "",
    remarks: "",
    items: [],
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        requestId: editData.requestId || "",
        orderDate: editData.createdAt?.split("T")[0] || "",
        requiredDate: editData.requiredDate?.split("T")[0] || "",
        priority: editData.priority || "",
        paymentOption: editData.paymentOption || "",
        remarks: editData.remarks || "",
        items: editData.items?.map(item => {
          const live = masalaItems.find(m => String(m._id) === String(item.itemId));
          return {
            itemId:   item.itemId,
            itemName: live?.itemName  ?? item.itemName,
            packSize: live?.packSize  ?? item.packSize,
            unit:     live?.unit      ?? item.unit,
            stock:    live?.stock     ?? 0,
            price:    live?.price     ?? item.price,
            quantity: item.quantity,
          };
        }) || [],
      });
    } else {
      setFormData(prev => ({
        ...prev,
        requestId: "",
        orderDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, [isEdit, editData, masalaItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, updatedFields) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], ...updatedFields };
      return { ...prev, items: updated };
    });
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId:"", itemName:"", packSize:"", unit:"", stock:0, price:0, quantity:"" }],
    }));
  };

  const removeItemRow = (index) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    if (!formData.requiredDate || !formData.priority || !formData.paymentOption) {
      toast.error("Please fill all required fields"); return false;
    }
    if (formData.items.length === 0) {
      toast.error("Please add at least one item"); return false;
    }
    if (formData.items.some(item => !item.itemId || !item.quantity)) {
      toast.error("Please fill item details"); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = {
        requiredDate: formData.requiredDate,
        priority: formData.priority,
        paymentOption: formData.paymentOption,
        remarks: formData.remarks,
        items: formData.items,
      };
      const response = isEdit ? await editRequest(id, payload) : await createRequest(payload);
      if (response.success) {
        toast.success(response.message);
        setTimeout(() => navigate("/manufacture-masala-franchise-request"), 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const totalQuantity = formData.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount   = formData.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);

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
                <h4 className="mb-0" style={{ fontWeight:800, fontSize:18, color:"#1A1A1A" }}>
                  {isEdit ? "Edit Franchise Request" : "Create Franchise Request"}
                </h4>
                <div style={{ fontSize:12, color:"#F97316", fontWeight:600, marginTop:1 }}>Masala · {isEdit ? "Edit" : "New"} Request</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button type="button" onClick={() => navigate(-1)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", borderRadius:9, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                <i className="bx bx-arrow-back" style={{ fontSize:15 }}/> Back
              </button>
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item"><Link to="/manufacture-masala-franchise-request">Franchise Requests</Link></li>
                <li className="breadcrumb-item active">{isEdit ? "Edit" : "Add"}</li>
              </ol>
            </div>
          </div>
        </div></div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* ── LEFT ── */}
            <div className="col-xl-8">

              {/* Request Details card */}
              <div className="card mb-3">
                <div className="card-body" style={{ padding:24 }}>
                  <SectionHeader icon="bx-detail" title="Request Details"/>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <FieldLabel>Request ID</FieldLabel>
                      <input style={readonlyStyle} value={formData.requestId || "Auto Generated"} readOnly/>
                    </div>
                    <div className="col-md-6">
                      <FieldLabel>Order Date</FieldLabel>
                      <input type="date" style={readonlyStyle} value={formData.orderDate} readOnly/>
                    </div>
                    <div className="col-md-6">
                      <FieldLabel required>Required Date</FieldLabel>
                      <input type="date" name="requiredDate" className="form-control" style={{ borderRadius:9, fontSize:13.5 }} value={formData.requiredDate} onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                      <FieldLabel required>Priority</FieldLabel>
                      <select name="priority" className="form-select" style={{ borderRadius:9, fontSize:13.5 }} value={formData.priority} onChange={handleChange}>
                        <option value="">Select Priority</option>
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <FieldLabel required>Payment Option</FieldLabel>
                      <select name="paymentOption" className="form-select" style={{ borderRadius:9, fontSize:13.5 }} value={formData.paymentOption} onChange={handleChange}>
                        <option value="">Select Payment</option>
                        {paymentModes?.map(p => (
                          <option key={p._id} value={p.paymentName}>{p.paymentName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12">
                      <FieldLabel>Remarks</FieldLabel>
                      <textarea rows={3} name="remarks" className="form-control" style={{ borderRadius:9, fontSize:13.5, resize:"vertical" }} value={formData.remarks} onChange={handleChange} placeholder="Optional notes about this request..."/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items card */}
              <div className="card">
                <div className="card-body" style={{ padding:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:14, borderBottom:"1.5px solid #f3f4f6" }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,rgba(217,30,24,0.12) 0%,rgba(249,115,22,0.08) 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className="bx bx-list-ul" style={{ color:"#D91E18", fontSize:17 }}/>
                    </div>
                    <div style={{ fontWeight:700, fontSize:14.5, color:"#1A1A1A" }}>Order Items</div>
                    {formData.items.length > 0 && (
                      <span style={{ background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{formData.items.length}</span>
                    )}
                    <button type="button" onClick={addItemRow} style={{ marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", fontWeight:700, fontSize:12.5, cursor:"pointer", boxShadow:"0 2px 8px rgba(217,30,24,0.25)" }}>
                      <i className="bx bx-plus" style={{ fontSize:15 }}/> Add Item
                    </button>
                  </div>

                  {/* Empty state */}
                  {formData.items.length === 0 && (
                    <div style={{ textAlign:"center", padding:"40px 20px", border:"2px dashed #f1f1f1", borderRadius:12, background:"#fafafa" }}>
                      <div style={{ width:56, height:56, borderRadius:14, background:"linear-gradient(135deg,rgba(217,30,24,0.06) 0%,rgba(249,115,22,0.04) 100%)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                        <i className="bx bx-bowl-hot" style={{ fontSize:26, color:"#D91E18", opacity:0.5 }}/>
                      </div>
                      <div style={{ fontWeight:600, color:"#9ca3af", fontSize:13.5 }}>No items added yet</div>
                      <div style={{ fontSize:12, color:"#d1d5db", marginTop:4 }}>Click "Add Item" to get started</div>
                    </div>
                  )}

                  {/* Item rows */}
                  {formData.items.map((item, index) => (
                    <div key={index} style={{ background:"#f9fafb", borderRadius:12, padding:16, marginBottom:12, border:"1.5px solid #f3f4f6" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5 }}>Item #{index + 1}</span>
                        <button type="button" onClick={() => removeItemRow(index)} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:8, border:"1.5px solid rgba(217,30,24,0.2)", background:"rgba(217,30,24,0.06)", color:"#D91E18", cursor:"pointer" }}>
                          <i className="bx bx-trash" style={{ fontSize:14 }}/>
                        </button>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-7">
                          <FieldLabel required>Item Name</FieldLabel>
                          <select className="form-select" style={{ borderRadius:9, fontSize:13.5 }} value={item.itemId} onChange={(e) => {
                            const sel = masalaItems.find(m => String(m._id) === String(e.target.value));
                            if (sel) handleItemChange(index, { itemId: sel._id, itemName: sel.itemName, packSize: sel.packSize, unit: sel.unit, stock: sel.stock, price: sel.price });
                          }}>
                            <option value="">Select masala item...</option>
                            {masalaItems.map(m => {
                              const taken = formData.items.some((fi, fi_i) => fi.itemId === m._id && fi_i !== index);
                              return <option key={m._id} value={m._id} disabled={taken}>{m.itemName} ({m.packSize} {m.unit})</option>;
                            })}
                          </select>

                          {item.itemId && (
                            <div style={{ display:"flex", gap:16, marginTop:8 }}>
                              <span style={{ fontSize:12, color:"#6b7280" }}>
                                <span style={{ color:"#9ca3af" }}>Pack:</span> <strong style={{ color:"#374151" }}>{item.packSize} {item.unit}</strong>
                              </span>
                              <span style={{ fontSize:12, color:"#6b7280" }}>
                                <span style={{ color:"#9ca3af" }}>Stock:</span>{" "}
                                <strong style={{ color: item.stock <= 5 ? "#D91E18" : "#059669" }}>{item.stock}</strong>
                                {item.stock <= 5 && <span style={{ fontSize:10.5, color:"#D91E18", fontWeight:700, marginLeft:4 }}>LOW</span>}
                              </span>
                              <span style={{ fontSize:12, color:"#6b7280" }}>
                                <span style={{ color:"#9ca3af" }}>Price:</span> <strong style={{ color:"#374151" }}>₹{item.price}</strong>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <FieldLabel required>Quantity</FieldLabel>
                          <input type="number" className="form-control" style={{ borderRadius:9, fontSize:13.5 }} value={item.quantity} min={1} onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > item.stock) { toast.error(`Only ${item.stock} in stock`); return; }
                            handleItemChange(index, { quantity: val });
                          }}/>
                          {item.itemId && item.quantity > 0 && (
                            <div style={{ fontSize:12, color:"#059669", fontWeight:700, marginTop:6 }}>
                              Amount: ₹{(Number(item.quantity) * Number(item.price)).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT sidebar ── */}
            <div className="col-xl-4">

              {/* Summary card */}
              <div className="card mb-3">
                <div className="card-body" style={{ padding:24 }}>
                  <SectionHeader icon="bx-receipt" title="Order Summary"/>

                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                    {/* Stats */}
                    {[
                      { label:"Total Items",    value: formData.items.length, icon:"bx-list-ul",  color:"#F97316" },
                      { label:"Total Quantity", value: totalQuantity,         icon:"bx-layer",    color:"#2563eb" },
                    ].map(s => (
                      <div key={s.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderRadius:10, background:"#f9fafb", border:"1.5px solid #f3f4f6" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <i className={`bx ${s.icon}`} style={{ fontSize:18, color:s.color }}/>
                          <span style={{ fontSize:13, color:"#6b7280", fontWeight:500 }}>{s.label}</span>
                        </div>
                        <span style={{ fontWeight:800, fontSize:16, color:"#1A1A1A" }}>{s.value}</span>
                      </div>
                    ))}

                    {/* Total Amount — prominent */}
                    <div style={{ padding:"16px 14px", borderRadius:12, background:"linear-gradient(135deg,rgba(5,150,105,0.06) 0%,rgba(5,150,105,0.03) 100%)", border:"1.5px solid rgba(5,150,105,0.2)" }}>
                      <div style={{ fontSize:11.5, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Total Amount</div>
                      <div style={{ fontWeight:800, fontSize:24, color:"#059669" }}>₹{totalAmount.toLocaleString()}</div>
                    </div>

                    {/* Priority indicator (if set) */}
                    {formData.priority && (
                      <div style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 14px", borderRadius:10, background: formData.priority === "Urgent" ? "rgba(217,30,24,0.06)" : "rgba(37,99,235,0.06)", border:`1.5px solid ${formData.priority === "Urgent" ? "rgba(217,30,24,0.2)" : "rgba(37,99,235,0.2)"}` }}>
                        <i className={`bx ${formData.priority === "Urgent" ? "bx-error" : "bx-check-circle"}`} style={{ fontSize:18, color: formData.priority === "Urgent" ? "#D91E18" : "#2563eb" }}/>
                        <span style={{ fontSize:13, fontWeight:700, color: formData.priority === "Urgent" ? "#D91E18" : "#2563eb" }}>{formData.priority} Priority</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:22 }}>
                    <button type="submit" disabled={loading} style={{ padding:"13px 0", borderRadius:11, border:"none", background:"linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color:"#fff", fontWeight:700, fontSize:14.5, cursor:loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 14px rgba(217,30,24,0.3)", opacity:loading ? 0.8 : 1 }}>
                      {loading
                        ? <><span className="spinner-border spinner-border-sm" style={{ width:15, height:15, borderWidth:2 }}/> Please wait...</>
                        : <><i className="bx bx-send" style={{ fontSize:17 }}/>{isEdit ? "Update Request" : "Create Request"}</>
                      }
                    </button>
                    <Link to="/manufacture-masala-franchise-request" style={{ padding:"11px 0", borderRadius:11, border:"1.5px solid #e5e7eb", background:"#f9fafb", color:"#374151", fontWeight:600, fontSize:13.5, textAlign:"center", textDecoration:"none", display:"block" }}>
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tips card */}
              <div className="card">
                <div className="card-body" style={{ padding:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <i className="bx bx-info-circle" style={{ fontSize:18, color:"#2563eb" }}/>
                    <span style={{ fontWeight:700, fontSize:13.5, color:"#1A1A1A" }}>Tips</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                    {[
                      "Select items with available stock only",
                      "Urgent priority orders are processed first",
                      "Set a realistic required date for delivery",
                    ].map((tip, i) => (
                      <div key={i} style={{ display:"flex", gap:8, fontSize:12.5, color:"#6b7280", lineHeight:1.5 }}>
                        <i className="bx bx-chevron-right" style={{ fontSize:14, color:"#F97316", flexShrink:0, marginTop:1 }}/>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>

      </div></div>
    </React.Fragment>
  );
};

export default MasalaFranchiseRequestForm;
