import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useFranchiseMenuStore, useFranchiseStore, useMenuItems, usePackageStore } from "../../../store/store";
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
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <i className={`bx ${s.icon}`} style={{ fontSize: 10 }} />{formatLabel(type)}
    </span>
  );
};

const FranchiseMenuVisibilityForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch]               = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [saving, setSaving]               = useState(false);
  const [packageMenuIds, setPackageMenuIds] = useState([]); // IDs from the franchise's package

  const { franchise, fetchFranchiseById } = useFranchiseStore();
  const { menuItems, fetchMenuItems }     = useMenuItems();
  const { packages, fetchPackages }       = usePackageStore();
  const { saveAssignedMenus }             = useFranchiseMenuStore();

  const rowData = location.state?.rowData || {};
  const franchiseName = franchise?.franchiseName || rowData?.franchiseName || "Franchise";
  const franchiseCode = franchise?.franchiseId   || rowData?.franchiseId   || `FR${id}`;
  const assignedPackage = franchise?.packageName || rowData?.packageName   || "";

  useEffect(() => {
    fetchMenuItems();
    fetchPackages();
    fetchFranchiseById(id);
  }, []);

  // When franchise + packages both loaded → pre-tick package menus
  useEffect(() => {
    if (!franchise || packages.length === 0) return;
    const pkgName = franchise.packageName;
    if (!pkgName) return;

    const matchedPkg = packages.find(
      (p) => p.packageName?.toLowerCase() === pkgName?.toLowerCase()
    );

    if (matchedPkg?.packageMenuItems?.length > 0) {
      const pkgIds = matchedPkg.packageMenuItems.map((m) =>
        typeof m === "object" ? m._id?.toString() : m.toString()
      );
      setPackageMenuIds(pkgIds);
      setSelectedMenus(pkgIds);
    } else {
      setPackageMenuIds([]);
      setSelectedMenus([]);
    }
  }, [franchise, packages]);

  const filteredMenus = useMemo(() => {
    const q = search.toLowerCase();
    return menuItems.filter((item) => {
      const matchSearch =
        item.menuName?.toLowerCase().includes(q) ||
        item.menuCode?.toLowerCase().includes(q);
      const matchCategory = categoryFilter === "ALL" || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [menuItems, search, categoryFilter]);

  const allFilteredSelected =
    filteredMenus.length > 0 &&
    filteredMenus.every((item) => selectedMenus.includes(item._id.toString()));

  const toggleMenu = (menuId) => {
    const mid = menuId.toString();
    setSelectedMenus((prev) =>
      prev.includes(mid) ? prev.filter((x) => x !== mid) : [...prev, mid]
    );
  };

  const toggleAll = () => {
    const ids = filteredMenus.map((item) => item._id.toString());
    if (allFilteredSelected) {
      setSelectedMenus((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedMenus((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const assignedMenus = menuItems
        .filter((item) => selectedMenus.includes(item._id.toString()))
        .map((item) => ({
          menuId: item._id,
          menuCode: item.menuCode,
          menuName: item.menuName,
          category: item.category,
          foodType: item.foodType,
          price: item.price,
          image: item.image,
          isCombo: item.isCombo,
          isAssigned: true,
          isVisibleInBilling: true,
        }));

      await saveAssignedMenus(id, { assignedMenus });
      toast.success("Menus assigned successfully");
      navigate("/master-franchise-menu-visibility");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to assign menus");
    } finally {
      setSaving(false);
    }
  };

  const pkgMenuCount = selectedMenus.filter(id => packageMenuIds.includes(id)).length;

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
                    <i className="bx bx-show" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>
                      Assign Menu Visibility
                    </h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>
                      Masters · Franchise Menu Visibility · Edit
                    </div>
                  </div>
                </div>
                <div className="page-title-right" style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button type="button" onClick={() => navigate(-1)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:8, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                    <i className="bx bx-arrow-back" style={{ fontSize:15 }} /> Back
                  </button>
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/master-franchise-menu-visibility">Menu Visibility</Link></li>
                    <li className="breadcrumb-item active">Edit</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* ── Franchise Info Banner ── */}
          <div className="card mb-3" style={{ border: "1px solid rgba(217,30,24,0.12)", background: "linear-gradient(135deg, rgba(217,30,24,0.03) 0%, rgba(249,115,22,0.04) 100%)" }}>
            <div className="card-body" style={{ padding: "16px 24px" }}>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "linear-gradient(135deg, #D91E18 0%, #F97316 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(217,30,24,0.3)", flexShrink: 0,
                  }}>
                    <i className="bx bx-store" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#1A1A1A" }}>{franchiseName}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace", marginTop: 2 }}>{franchiseCode}</div>
                  </div>
                  {assignedPackage && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 16, borderLeft: "1.5px solid rgba(217,30,24,0.15)" }}>
                      <div>
                        <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Assigned Package</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 3, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#D91E18", background: "rgba(217,30,24,0.07)", border: "1px solid rgba(217,30,24,0.18)" }}>
                          <i className="bx bx-package" style={{ fontSize: 12 }} />{assignedPackage}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 12, background: "#fff", border: "1px solid rgba(217,30,24,0.12)" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#D91E18" }}>{selectedMenus.length}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Total Selected</div>
                  </div>
                  {packageMenuIds.length > 0 && (
                    <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 12, background: "#fff", border: "1px solid rgba(249,115,22,0.18)" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#F97316" }}>{packageMenuIds.length}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Package Menus</div>
                    </div>
                  )}
                </div>
              </div>
              {packageMenuIds.length > 0 && (
                <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="bx bx-info-circle" style={{ color: "#F97316", fontSize: 14, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#92400E" }}>
                    <strong>{packageMenuIds.length}</strong> menus from the <strong>{assignedPackage}</strong> package are pre-selected. You can add or remove menus as needed.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Main Card ── */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h4 className="card-title mb-0">All Menu Items</h4>
                  <span style={{
                    background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)",
                    color: "#fff", borderRadius: 10,
                    padding: "2px 9px", fontSize: 11, fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(217,30,24,0.3)",
                  }}>{filteredMenus.length}</span>
                </div>
                <button
                  type="button"
                  onClick={toggleAll}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                    border: `1.5px solid ${allFilteredSelected ? "rgba(153,27,27,0.25)" : "rgba(37,99,235,0.25)"}`,
                    background: allFilteredSelected ? "rgba(153,27,27,0.06)" : "rgba(37,99,235,0.06)",
                    color: allFilteredSelected ? "#991B1B" : "#1D4ED8",
                  }}
                >
                  <i className={`bx ${allFilteredSelected ? "bx-checkbox" : "bx-checkbox-checked"}`} style={{ fontSize: 16 }} />
                  {allFilteredSelected ? "Deselect All Visible" : "Select All Visible"}
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* ── Filters ── */}
              <div className="row mb-3 g-2 align-items-center">
                <div className="col-sm-12 col-md-5">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by menu name or code..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="bx bx-search position-absolute" style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: "#adb5bd" }} />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
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
                <div className="col-md-4 text-end d-flex align-items-center justify-content-md-end">
                  <span className="text-muted font-size-13">
                    <strong style={{ color: "#D91E18" }}>{selectedMenus.length}</strong> selected · {filteredMenus.length} shown
                  </span>
                </div>
              </div>

              {/* ── Table ── */}
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-hover table-centered align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: 50 }}>
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={toggleAll}
                            style={{ cursor: "pointer", width: 16, height: 16 }}
                          />
                        </div>
                      </th>
                      <th style={{ width: 60 }}>Image</th>
                      <th>Menu Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMenus.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <i className="bx bx-search-alt display-4 d-block mb-2" />
                          No menu items found.
                        </td>
                      </tr>
                    ) : filteredMenus.map((item) => {
                      const isChecked = selectedMenus.includes(item._id.toString());
                      const isFromPackage = packageMenuIds.includes(item._id.toString());
                      return (
                        <tr
                          key={item._id}
                          onClick={() => toggleMenu(item._id)}
                          style={{
                            cursor: "pointer",
                            background: isChecked ? "rgba(217,30,24,0.03)" : undefined,
                            borderLeft: isChecked ? "3px solid #D91E18" : "3px solid transparent",
                          }}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleMenu(item._id)}
                                style={{ cursor: "pointer", width: 16, height: 16 }}
                              />
                            </div>
                          </td>
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
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: isChecked ? "#D91E18" : "#1A1A1A" }}>{item.menuName}</div>
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
                          <td>
                            {item.isCombo ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#6D28D9", background: "rgba(109,40,217,0.07)", border: "1px solid rgba(109,40,217,0.18)" }}>
                                <i className="bx bx-package" style={{ fontSize: 11 }} />Combo
                              </span>
                            ) : (
                              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>Single</span>
                            )}
                          </td>
                          <td>
                            {isFromPackage ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, color: "#F97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)" }}>
                                <i className="bx bx-package" style={{ fontSize: 11 }} />Package
                              </span>
                            ) : (
                              <span style={{ fontSize: 11, color: "#d1d5db" }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Footer ── */}
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {selectedMenus.length > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, color: "#D91E18", background: "rgba(217,30,24,0.07)", border: "1px solid rgba(217,30,24,0.18)" }}>
                      <i className="bx bx-check-circle" style={{ fontSize: 14 }} />
                      {selectedMenus.length} menus will be assigned
                    </span>
                  )}
                  {packageMenuIds.length > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, color: "#F97316", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.22)" }}>
                      <i className="bx bx-package" style={{ fontSize: 14 }} />
                      {pkgMenuCount} of {packageMenuIds.length} package menus selected
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Link
                    to="/master-franchise-menu-visibility"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 13.5, textDecoration: "none" }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "10px 24px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #D91E18 0%, #F97316 100%)",
                      color: "#fff", fontWeight: 700, fontSize: 13.5,
                      cursor: saving ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 14px rgba(217,30,24,0.35)",
                      opacity: saving ? 0.82 : 1,
                    }}
                  >
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm" style={{ width: 15, height: 15, borderWidth: 2 }} />Saving...</>
                    ) : (
                      <><i className="bx bx-save" style={{ fontSize: 17 }} />Save Visibility</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
};

export default FranchiseMenuVisibilityForm;
