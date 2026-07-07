import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFranchiseMenuStore } from "../../../store/store";
import { toast } from "react-toastify";

const formatLabel = (value) => {
  if (!value) return "";
  return value.toString().toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const FOOD_TYPE_STYLE = {
  VEG:     { color: "#065F46", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",  icon: "bx-leaf" },
  NON_VEG: { color: "#991B1B", bg: "rgba(153,27,27,0.07)", border: "rgba(153,27,27,0.18)",  icon: "bx-bowl-hot" },
  BEVERAGE:{ color: "#1D4ED8", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", icon: "bx-drink" },
};

const foodTypePill = (type) => {
  if (!type) return null;
  const s = FOOD_TYPE_STYLE[type] || { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb", icon: "bx-food-menu" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <i className={`bx ${s.icon}`} style={{ fontSize: 10 }} />{formatLabel(type)}
    </span>
  );
};

const FranchiseMenuAvailability = () => {
  const [search, setSearch]               = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [availFilter, setAvailFilter]     = useState("ALL");
  const [page, setPage]                   = useState(1);
  const [perPage, setPerPage]             = useState(10);
  const [updatingId, setUpdatingId]       = useState(null);

  const { menus, loading, fetchMyMenus, updateVisibility } = useFranchiseMenuStore();

  useEffect(() => { fetchMyMenus(); }, []);

  const handleToggle = async (menuId, value) => {
    setUpdatingId(menuId);
    try {
      await updateVisibility({ menuId, isVisibleInBilling: value });
      toast.success(`Menu ${value ? "shown in" : "hidden from"} billing`);
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = menus.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      item.menuName?.toLowerCase().includes(q) ||
      item.menuCode?.toLowerCase().includes(q);
    const matchCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    const matchAvail =
      availFilter === "ALL" ||
      (availFilter === "VISIBLE" && item.isVisibleInBilling) ||
      (availFilter === "HIDDEN" && !item.isVisibleInBilling);
    return matchSearch && matchCategory && matchAvail;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const visibleCount = menus.filter((m) => m.isVisibleInBilling).length;
  const hiddenCount  = menus.length - visibleCount;

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
                    <i className="bx bx-toggle-right" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>
                      Menu Availability
                    </h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>
                      My Menu · Billing Visibility
                    </div>
                  </div>
                </div>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Menu Availability</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary strip ── */}
          {!loading && menus.length > 0 && (
            <div className="row mb-3 g-3">
              {[
                { label: "Total Menus",    value: menus.length,  color: "#1D4ED8", icon: "bx-food-menu",     bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)" },
                { label: "Visible",        value: visibleCount,  color: "#065F46", icon: "bx-show",          bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)" },
                { label: "Hidden",         value: hiddenCount,   color: "#991B1B", icon: "bx-hide",          bg: "rgba(153,27,27,0.07)",   border: "rgba(153,27,27,0.18)" },
              ].map(({ label, value, color, icon, bg, border }) => (
                <div key={label} className="col-4">
                  <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`bx ${icon}`} style={{ color, fontSize: 18 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Card ── */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h4 className="card-title mb-0">My Menu Items</h4>
                  <span style={{
                    background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)",
                    color: "#fff", borderRadius: 10,
                    padding: "2px 9px", fontSize: 11, fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(217,30,24,0.3)",
                  }}>{filtered.length}</span>
                </div>
                <span style={{ fontSize: 12.5, color: "#6b7280" }}>
                  Toggle the switch to show or hide a menu item in billing
                </span>
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
                      placeholder="Search by menu name or code..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                    <i className="bx bx-search position-absolute" style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: "#adb5bd" }} />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <select className="form-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                    <option value="ALL">All Categories</option>
                    <option value="FRIED_CHICKEN">Fried Chicken</option>
                    <option value="NUGGETS">Nuggets</option>
                    <option value="FRIES">Fries</option>
                    <option value="SANDWICH">Sandwich</option>
                    <option value="FRANKIES">Frankies</option>
                    <option value="BURGER">Burger</option>
                    <option value="MOMOS">Momos</option>
                    <option value="MOJITO">Mojito</option>
                    <option value="BUBBLE_TEA">Bubble Tea</option>
                    <option value="DESSERT">Dessert</option>
                    <option value="COMBO">Combo</option>
                  </select>
                </div>
                <div className="col-sm-6 col-md-2">
                  <select className="form-select" value={availFilter} onChange={(e) => { setAvailFilter(e.target.value); setPage(1); }}>
                    <option value="ALL">All Visibility</option>
                    <option value="VISIBLE">Visible</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </div>
                <div className="col-md-2 text-end d-flex align-items-center justify-content-md-end">
                  <span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* ── Table ── */}
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: "#D91E18", width: 36, height: 36, borderWidth: 3 }} role="status" />
                    <div style={{ fontSize: 13, color: "#98a2b3", marginTop: 12 }}>Loading menu items...</div>
                  </div>
                ) : (
                  <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: 55 }}>S.No</th>
                        <th style={{ width: 60 }}>Image</th>
                        <th>Menu Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th className="text-center">Visible in Billing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                            <i className="bx bx-search-alt display-4 d-block mb-2" />
                            No menu items found.
                          </td>
                        </tr>
                      ) : paged.map((item, index) => (
                        <tr key={item.menuId || item._id}>
                          <td style={{ color: "#98a2b3", fontSize: 12 }}>{(page - 1) * perPage + index + 1}</td>
                          <td>
                            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", border: "2px solid #f3f4f6", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {item.image ? (
                                <img src={item.image} alt={item.menuName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <i className="bx bx-image-alt" style={{ fontSize: 18, color: "#d1d5db" }} />
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>{item.menuName}</div>
                            {item.menuCode && (
                              <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginTop: 1 }}>#{item.menuCode}</div>
                            )}
                            <div style={{ marginTop: 3 }}>{foodTypePill(item.foodType)}</div>
                          </td>
                          <td>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{formatLabel(item.category)}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>₹{item.price}</span>
                          </td>
                          <td className="text-center">
                            {updatingId === (item.menuId || item._id) ? (
                              <div className="d-flex justify-content-center">
                                <div className="spinner-border spinner-border-sm" style={{ color: "#D91E18", width: 18, height: 18, borderWidth: 2 }} />
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div className="form-check form-switch d-flex justify-content-center mb-0">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={!!item.isVisibleInBilling}
                                    onChange={(e) => handleToggle(item.menuId || item._id, e.target.checked)}
                                    style={{ cursor: "pointer", width: 36, height: 20, ...(item.isVisibleInBilling ? { backgroundColor: "#D91E18", borderColor: "#D91E18" } : {}) }}
                                  />
                                </div>
                                <span style={{
                                  fontSize: 10.5, fontWeight: 700,
                                  color: item.isVisibleInBilling ? "#065F46" : "#991B1B",
                                }}>
                                  {item.isVisibleInBilling ? "Visible" : "Hidden"}
                                </span>
                              </div>
                            )}
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
    </React.Fragment>
  );
};

export default FranchiseMenuAvailability;
