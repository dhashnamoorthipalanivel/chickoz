import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Select from "react-select";
import { useDocuments, useFranchiseStore, useMaterials } from "../../../store/store";

/* ── Custom react-select styles (removes default red hover background on tag remove button) ── */
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#F97316" : "#ede9e0",
    boxShadow: state.isFocused ? "0 0 0 3.5px rgba(249,115,22,0.14)" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#F97316" : "#cbd5e1",
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e5e7eb",
    borderRadius: "6px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "13px",
    fontWeight: "500",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#6b7280",
    borderRadius: "0 6px 6px 0",
    cursor: "pointer",
    backgroundColor: "transparent",
    ":hover": {
      backgroundColor: "#cbd5e1",
      color: "#111827",
    },
    ":focus": {
      backgroundColor: "transparent",
      color: "#111827",
    },
    ":active": {
      backgroundColor: "transparent",
      color: "#111827",
    },
  }),
  input: (base) => ({
    ...base,
    color: "#1f2937",
    outline: "none !important",
    boxShadow: "none !important",
    border: "none !important",
    "& input": {
      outline: "none !important",
      boxShadow: "none !important",
      border: "none !important",
    },
  }),
};

/* ── Map defaults ── */
const KOMAR = [11.4467, 77.6958]; // Komarapalayam, Tamil Nadu
const KM_LIMIT = 5;

/* ── Helpers ── */
const formatLabel = (v) =>
  v?.toString().toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const geocodeStr = async (str) => {
  if (!str) return null;
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(str + ", India")}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const d = await r.json();
    return d[0] ? { lat: +d[0].lat, lng: +d[0].lon } : null;
  } catch { return null; }
};

const reverseGeocode = async (lat, lng) => {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
    );
    const d = await r.json();
    return d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch { return `${lat.toFixed(5)}, ${lng.toFixed(5)}`; }
};

/* ── UI sub-components ── */
const SectionHeader = ({ icon, title, c1 = "#D91E18", c2 = "#F97316" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
    <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${c1},${c2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${c1}38`, flexShrink: 0 }}>
      <i className={icon} style={{ color: "#fff", fontSize: 16 }} />
    </div>
    <h5 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A1A", margin: 0 }}>{title}</h5>
  </div>
);

const FL = ({ children, required }) => (
  <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
    {children}{required && <span style={{ color: "#D91E18", marginLeft: 3 }}>*</span>}
  </label>
);

/* ── Map: custom SVG pin icon ── */
const pinIcon = (color) => L.divIcon({
  className: "",
  html: `<svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 34 12 34C12 34 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  iconSize: [24, 34],
  iconAnchor: [12, 34],
  popupAnchor: [0, -38],
});

/* ── Map: click event handler ── */
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
};

/* ── Map: smooth fly-to on selection change ── */
const FlyTo = ({ lat, lng }) => {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (lat && lng && (prev.current?.lat !== lat || prev.current?.lng !== lng)) {
      map.flyTo([lat, lng], 15, { duration: 0.8 });
      prev.current = { lat, lng };
    }
  }, [lat, lng]);
  return null;
};

/* ── Site Visit interactive map ── */
const SiteVisitMap = ({ stageData, onSelect, isLocked }) => {
  const { franchises, fetchFranchises } = useFranchiseStore();
  const [franchiseCoords, setFranchiseCoords] = useState([]);
  const [checking, setChecking] = useState(false);
  const geocodedRef = useRef(false);

  useEffect(() => { fetchFranchises(); }, []);

  useEffect(() => {
    if (geocodedRef.current || franchises.length === 0) return;
    geocodedRef.current = true;
    (async () => {
      const results = await Promise.all(
        franchises.filter(f => f.location).map(async f => {
          const c = await geocodeStr(f.location);
          return c ? { name: f.franchiseName || f.franchiseId || f.location, ...c } : null;
        })
      );
      setFranchiseCoords(results.filter(Boolean));
    })();
  }, [franchises]);

  const handleClick = async (lat, lng) => {
    if (isLocked || checking) return;
    setChecking(true);

    for (const fc of franchiseCoords) {
      const dist = haversineKm(lat, lng, fc.lat, fc.lng);
      if (dist <= KM_LIMIT) {
        toast.error(
          `This location is within ${KM_LIMIT}km of franchise "${fc.name}". Please select a different location.`,
          { autoClose: 6000 }
        );
        setChecking(false);
        return;
      }
    }

    const address = await reverseGeocode(lat, lng);
    onSelect(lat, lng, address);
    setChecking(false);
  };

  const initCenter = stageData.lat && stageData.lng
    ? [stageData.lat, stageData.lng]
    : KOMAR;

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #e5e7eb", position: "relative" }}>
      {checking && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(2px)" }}>
          <div style={{ background: "#fff", padding: "12px 22px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="spinner-border spinner-border-sm text-danger" /> Checking location…
          </div>
        </div>
      )}
      <MapContainer center={initCenter} zoom={13} style={{ height: 360, width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickHandler onMapClick={handleClick} />
        {stageData.lat && stageData.lng && (
          <>
            <FlyTo lat={stageData.lat} lng={stageData.lng} />
            <Marker position={[stageData.lat, stageData.lng]} icon={pinIcon("#D91E18")}>
              <Popup><strong>Selected Location</strong><br />{stageData.location}</Popup>
            </Marker>
          </>
        )}
        {franchiseCoords.map((fc, i) => (
          <React.Fragment key={i}>
            <Marker position={[fc.lat, fc.lng]} icon={pinIcon("#F97316")}>
              <Popup>
                <strong>{fc.name}</strong><br />
                <span style={{ color: "#D91E18", fontSize: 12 }}>⚠ {KM_LIMIT}km exclusion zone</span>
              </Popup>
            </Marker>
            <Circle
              center={[fc.lat, fc.lng]}
              radius={KM_LIMIT * 1000}
              pathOptions={{ color: "#F97316", fillColor: "#F97316", fillOpacity: 0.09, weight: 2, dashArray: "6 3" }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
      <div style={{ padding: "9px 14px", background: "#f9fafb", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: 12, color: "#6b7280" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#D91E18", display: "inline-block" }} /> Selected location
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F97316", display: "inline-block" }} /> Franchise ({KM_LIMIT}km zone)
        </span>
        <span>Click on the map to select the site visit location</span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════ */
const LeadStageForm = ({ activeStage, formData, setFormData, stages, paymentModes, isLocked }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentStage = stages[activeStage];
    setFormData((prev) => {
      const updatedData = {
        ...prev.stages[currentStage].data,
        [name]: name.toLowerCase().includes("date") ? new Date(value) : value,
      };
      if (name === "cartRequired") {
        if (value === "no") {
          updatedData.cartRequiredDate = "";
          updatedData.cartPriority = "";
          updatedData.cartSize = "";
          updatedData.cartAmount = 0;
          updatedData.cartManufactureStatus = "NOT_REQUIRED";
          updatedData.cartAssignedVendor = "";
          updatedData.brandingType = "";
          updatedData.accessories = "";
        }
        if (value === "yes") {
          const pkgMaterials = formData?.interestedPackage?.packageMaterials || [];
          const defaultAcc = pkgMaterials.length > 0
            ? pkgMaterials.map(m => resolveMaterialName(m)).filter(Boolean).join(", ")
            : formData?.interestedPackage?.accessories || "";

          updatedData.cartRequiredDate = "";
          updatedData.cartPriority = "";
          updatedData.cartSize = formData?.interestedPackage?.cartSize || "";
          updatedData.cartAmount = formData?.interestedPackage?.cartAmount || 0;
          updatedData.brandingType = formData?.interestedPackage?.brandingType || "";
          updatedData.accessories = defaultAcc;
          updatedData.cartManufactureStatus = "PENDING";
        }
      }
      return {
        ...prev,
        stages: {
          ...prev.stages,
          [currentStage]: { ...prev.stages[currentStage], data: updatedData },
        },
      };
    });
  };

  /* ── Master Materials for Accessories ── */
  const { materials, fetchMaterials } = useMaterials();
  useEffect(() => { fetchMaterials(); }, []);

  const resolveMaterialName = (item) => {
    if (!item) return "";
    if (typeof item === "object" && item.materialName) return item.materialName;
    const key = (typeof item === "object" ? item._id : item)?.toString().trim();
    if (!key) return "";
    const matched = (materials || []).find(m => m._id === key || m.materialName?.toLowerCase() === key.toLowerCase());
    if (matched) return matched.materialName;
    if (/^[0-9a-fA-F]{24}$/.test(key)) return "";
    return key;
  };

  const materialOptions = useMemo(() => {
    const list = (materials || [])
      .filter(m => m.status !== "INACTIVE" && !m.isDeleted)
      .map(m => ({ value: m.materialName, label: m.materialName }));

    const pkgMaterials = formData?.interestedPackage?.packageMaterials || [];
    pkgMaterials.forEach(pm => {
      const name = resolveMaterialName(pm);
      if (name && !list.some(o => o.value.toLowerCase() === name.toLowerCase())) {
        list.push({ value: name, label: name });
      }
    });
    return list;
  }, [materials, formData?.interestedPackage]);

  /* ── Documents (APPROVAL stage) ── */
  const { documents: masterDocs, fetchDocuments } = useDocuments();
  const activeDocs = masterDocs.filter(d => d.status === "ACTIVE");

  useEffect(() => { fetchDocuments(); }, []);

  /* Sync master doc list into formData.stages.APPROVAL.data.documents on first load */
  useEffect(() => {
    if (activeDocs.length === 0) return;
    setFormData(prev => {
      const existing = prev?.stages?.APPROVAL?.data?.documents || [];
      const merged = activeDocs.map(md => {
        const saved = existing.find(e => String(e.documentId) === String(md._id));
        return saved || { documentId: md._id, documentName: md.documentName, documentType: md.documentType, isMandatory: md.isMandatory, submitted: false, fileName: "" };
      });
      const noChange = JSON.stringify(merged) === JSON.stringify(existing);
      if (noChange) return prev;
      return {
        ...prev,
        stages: {
          ...prev.stages,
          APPROVAL: { ...prev.stages.APPROVAL, data: { ...prev.stages.APPROVAL.data, documents: merged } },
        },
      };
    });
  }, [activeDocs.length]);

  const updateDocumentSubmitted = (docId, docName, docType, isMandatory, checked) => {
    setFormData(prev => {
      const current = prev?.stages?.APPROVAL?.data?.documents || [];
      const idx = current.findIndex(d => String(d.documentId) === String(docId));
      let updated;
      if (idx >= 0) {
        updated = current.map((d, i) => i === idx ? { ...d, submitted: checked, fileName: checked ? d.fileName : "" } : d);
      } else {
        updated = [...current, { documentId: docId, documentName: docName, documentType: docType, isMandatory, submitted: checked, fileName: "" }];
      }
      return { ...prev, stages: { ...prev.stages, APPROVAL: { ...prev.stages.APPROVAL, data: { ...prev.stages.APPROVAL.data, documents: updated } } } };
    });
  };

  const updateDocumentFile = (docId, fileName) => {
    setFormData(prev => {
      const current = prev?.stages?.APPROVAL?.data?.documents || [];
      const updated = current.map(d => String(d.documentId) === String(docId) ? { ...d, fileName } : d);
      return { ...prev, stages: { ...prev.stages, APPROVAL: { ...prev.stages.APPROVAL, data: { ...prev.stages.APPROVAL.data, documents: updated } } } };
    });
  };

  const updateDocumentExpiryDate = (docId, expiryDate) => {
    setFormData(prev => {
      const current = prev?.stages?.APPROVAL?.data?.documents || [];
      const updated = current.map(d => String(d.documentId) === String(docId) ? { ...d, expiryDate } : d);
      return { ...prev, stages: { ...prev.stages, APPROVAL: { ...prev.stages.APPROVAL, data: { ...prev.stages.APPROVAL.data, documents: updated } } } };
    });
  };

  /* Called by SiteVisitMap after 1km check passes + reverse geocode */
  const handleLocationSelect = (lat, lng, address) => {
    const currentStage = stages[activeStage];
    setFormData(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [currentStage]: {
          ...prev.stages[currentStage],
          data: { ...prev.stages[currentStage].data, location: address, lat, lng },
        },
      },
    }));
  };

  const stage = stages[activeStage];
  const stageData = formData?.stages?.[stage]?.data || {};

  /* ── Payment calculations (same as before) ── */
  const paidAmount = (stageData.payments || []).reduce((a, b) => a + b.amount, 0);
  const packageData = formData?.interestedPackage || {};
  const cartRequired = formData?.stages?.TRAINING?.data?.cartRequired;
  const packagePrice = Number(packageData.price || 0);
  const cartAmountPkg = Number(packageData.cartAmount || 0);
  const gstPercentage = Number(packageData.taxPercentage || 0);
  let baseAmount = packagePrice;
  if (cartRequired === "yes" || cartRequired === true) baseAmount += cartAmountPkg;
  let gstAmount = 0;
  if (packageData.isTaxApplicable) {
    gstAmount = packageData.isTaxInclusive
      ? (baseAmount * gstPercentage) / (100 + gstPercentage)
      : (baseAmount * gstPercentage) / 100;
  }
  const totalAmount = packageData.isTaxInclusive ? Math.round(baseAmount) : Math.round(baseAmount + gstAmount);
  const isFullyPaid = paidAmount >= totalAmount;
  const pendingAmount = Math.max(totalAmount - paidAmount, 0);

  useEffect(() => {
    setFormData((prev) => {
      const currentPaid = prev?.stages?.PAYMENT?.data?.paidAmount || 0;
      const currentPending = prev?.stages?.PAYMENT?.data?.pendingAmount || 0;
      const newPending = Math.max(totalAmount - paidAmount, 0);
      if (currentPaid === paidAmount && currentPending === newPending) return prev;
      return {
        ...prev,
        stages: {
          ...prev.stages,
          PAYMENT: {
            ...prev.stages.PAYMENT,
            data: { ...prev.stages.PAYMENT.data, paidAmount, pendingAmount: newPending },
          },
        },
      };
    });
  }, [paidAmount, totalAmount]);

  useEffect(() => {
    if (!formData?.interestedPackage) return;
    const pkg = formData.interestedPackage;
    setFormData((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        TRAINING: {
          ...prev.stages.TRAINING,
          data: {
            ...prev.stages.TRAINING.data,
            cartRequired: prev?.stages?.TRAINING?.data?.cartRequired || "",
            trainingStatus: prev?.stages?.TRAINING?.data?.trainingStatus || "",
            trainingStart: prev?.stages?.TRAINING?.data?.trainingStart || "",
            parentsDetails: prev?.stages?.TRAINING?.data?.parentsDetails || "",
            cartRequiredDate: prev?.stages?.TRAINING?.data?.cartRequiredDate || "",
            cartPriority: prev?.stages?.TRAINING?.data?.cartPriority || "",
            cartManufactureStatus: prev?.stages?.TRAINING?.data?.cartManufactureStatus || "",
            cartAssignedVendor: prev?.stages?.TRAINING?.data?.cartAssignedVendor || "",
            cartSize: (prev?.stages?.TRAINING?.data?.cartRequired === "yes" || prev?.stages?.TRAINING?.data?.cartRequired === true) ? pkg.cartSize || "" : "",
            cartAmount: (prev?.stages?.TRAINING?.data?.cartRequired === "yes" || prev?.stages?.TRAINING?.data?.cartRequired === true) ? pkg.cartAmount || 0 : 0,
          },
        },
        PAYMENT: {
          ...prev.stages.PAYMENT,
          data: { ...prev.stages.PAYMENT.data, totalAmount, advanceAmount: pkg.advanceAmount || 0 },
        },
      },
    }));
  }, [formData?.interestedPackage, formData?.stages?.TRAINING?.data?.cartRequired]);

  return (
    <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <div className="card-body" style={{ padding: "24px 26px", pointerEvents: isLocked ? "none" : "auto", opacity: isLocked ? 0.8 : 1 }}>

        {isLocked && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(217,30,24,0.07)", border: "1px solid rgba(217,30,24,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
            <i className="bx bx-lock-alt" style={{ color: "#D91E18", fontSize: 20, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: "#D91E18", fontWeight: 600 }}>
              Lead is {formatLabel(formData.leadStatus)} — editing is disabled.
            </span>
          </div>
        )}

        <div className="row g-3">

          {/* ══ SITE VISIT ══ */}
          {stage === "SITE_VISIT" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-map" title="Site Visit & Walk-in" />
              </div>

              <div className="col-md-6">
                <FL required>Visit Type</FL>
                <select name="visitType" className="form-select" value={stageData.visitType || ""} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Walk-in</option>
                  <option>Site Visit</option>
                </select>
              </div>

              <div className="col-md-6">
                <FL required>Visit Date</FL>
                <input type="date" name="visitDate" className="form-control"
                  value={stageData.visitDate ? new Date(stageData.visitDate).toISOString().split("T")[0] : ""}
                  onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <FL required>Location</FL>
                <div className="position-relative">
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={stageData.location || ""}
                    onChange={handleChange}
                    placeholder="Click map to auto-fill, or type manually…"
                    style={{ paddingRight: 36 }}
                  />
                  <i className="bx bx-map-pin position-absolute"
                    style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: stageData.lat ? "#D91E18" : "#adb5bd", fontSize: 16 }} />
                </div>
                {stageData.lat && stageData.lng && (
                  <div style={{ fontSize: 11.5, color: "#059669", marginTop: 4, fontWeight: 600 }}>
                    <i className="bx bx-check-circle me-1" />{stageData.lat.toFixed(5)}, {stageData.lng.toFixed(5)}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <FL>Delivery Location</FL>
                <input type="text" name="deliveryLocation" className="form-control"
                  value={stageData.deliveryLocation || ""} onChange={handleChange} placeholder="Enter delivery location" />
              </div>

              <div className="col-12">
                <FL>Select on Map <span style={{ color: "#6b7280", fontWeight: 500, fontSize: 11.5 }}>(orange zones = existing franchise — cannot select within {KM_LIMIT}km)</span></FL>
                <SiteVisitMap stageData={stageData} onSelect={handleLocationSelect} isLocked={isLocked} />
              </div>
            </>
          )}

          {/* ══ APPROVAL ══ */}
          {stage === "APPROVAL" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-check-shield" title="Approval & Legal" c1="#2563eb" c2="#60a5fa" />
              </div>

              <div className="col-md-6">
                <FL required>Site Status</FL>
                <select name="siteStatus" className="form-select" value={stageData.siteStatus || ""} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Pending</option>
                  <option>Approved</option>
                </select>
              </div>

              <div className="col-md-6">
                <FL required>Approval Status</FL>
                <select name="approvalStatus" className="form-select" value={stageData.approvalStatus || ""} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="col-md-6">
                <FL required>Legal Formalities</FL>
                <select name="legalStatus" className="form-select" value={stageData.legalStatus || ""} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* ── Document Checklist ── */}
              <div className="col-12" style={{ marginTop: 8 }}>
                <SectionHeader icon="bx bx-file-blank" title="Document Submission" c1="#7c3aed" c2="#a78bfa" />

                {activeDocs.length === 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px", background: "#f9fafb", borderRadius: 10, border: "1px dashed #e5e7eb" }}>
                    <i className="bx bx-info-circle" style={{ color: "#9ca3af", fontSize: 20 }} />
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>No documents configured in master. Add documents via <strong>Master → Document</strong>.</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeDocs.map(doc => {
                      const saved = (stageData.documents || []).find(d => String(d.documentId) === String(doc._id));
                      const isChecked = saved?.submitted || false;
                      const savedFile = saved?.fileName || "";
                      const savedExpiryDate = saved?.expiryDate ? new Date(saved.expiryDate).toISOString().split("T")[0] : "";

                      const typeColors = {
                        LEGAL: { color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.2)" },
                        LICENSE: { color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)" },
                        IDENTITY: { color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
                        FINANCIAL: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.2)" },
                        MEDIA: { color: "#F97316", bg: "rgba(249,115,22,0.09)", border: "rgba(249,115,22,0.2)" },
                        ADDRESS_PROOF: { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
                      };
                      const tc = typeColors[doc.documentType] || { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" };

                      return (
                        <div key={doc._id}
                          style={{ borderRadius: 12, border: `1.5px solid ${isChecked ? "rgba(37,99,235,0.3)" : "#e5e7eb"}`, background: isChecked ? "rgba(37,99,235,0.04)" : "#fafafa", padding: "14px 16px", transition: "border-color 0.2s, background 0.2s" }}>

                          {/* Row: checkbox + info */}
                          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: isLocked ? "default" : "pointer", margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isLocked}
                              onChange={e => updateDocumentSubmitted(doc._id, doc.documentName, doc.documentType, doc.isMandatory, e.target.checked)}
                              style={{ width: 18, height: 18, minWidth: 18, accentColor: "#2563eb", cursor: isLocked ? "default" : "pointer" }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{doc.documentName}</span>
                                <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: tc.color, background: tc.bg, border: `1px solid ${tc.border}`, whiteSpace: "nowrap" }}>
                                  {formatLabel(doc.documentType)}
                                </span>
                                {doc.isMandatory && (
                                  <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#D91E18", background: "rgba(217,30,24,0.07)", border: "1px solid rgba(217,30,24,0.2)", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <i className="bx bx-check-shield" style={{ fontSize: 12 }} /> Mandatory
                                  </span>
                                )}
                                {doc.validationYear && (
                                  <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <i className="bx bx-calendar-star" style={{ fontSize: 12 }} /> Validation: {doc.validationYear} {doc.validationYear > 1 ? 'Years' : 'Year'}
                                  </span>
                                )}
                              </div>
                              {doc.description && (
                                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>{doc.description}</div>
                              )}
                            </div>
                            {/* Status indicator */}
                            {isChecked && savedFile && (
                              <i className="bx bx-check-circle" style={{ color: "#059669", fontSize: 20, flexShrink: 0 }} />
                            )}
                          </label>

                          {/* File upload — shown only when checked */}
                          {isChecked && (
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(37,99,235,0.12)" }}>
                              <div className="row">
                                <div className="col-md-6">
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                                    Upload: {doc.documentName}
                                    {doc.isMandatory && <span style={{ color: "#D91E18", marginLeft: 3 }}>*</span>}
                                  </div>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    disabled={isLocked}
                                    onChange={e => {
                                      const file = e.target.files[0];
                                      if (file) updateDocumentFile(doc._id, file.name);
                                    }}
                                  />
                                </div>
                                <div className="col-md-6 mt-2 mt-md-0">
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                                    Validate Date
                                  </div>
                                  <input
                                    type="date"
                                    className="form-control"
                                    disabled={isLocked}
                                    value={savedExpiryDate}
                                    onChange={e => updateDocumentExpiryDate(doc._id, e.target.value)}
                                  />
                                </div>
                              </div>
                              {savedFile && (
                                <div style={{ marginTop: 8 }}>
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.22)" }}>
                                    <i className="bx bx-check-circle" style={{ fontSize: 14 }} /> {savedFile}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Summary counts */}
                    {(() => {
                      const docs = stageData.documents || [];
                      const submitted = docs.filter(d => d.submitted).length;
                      const withFile = docs.filter(d => d.submitted && d.fileName).length;
                      const mandatory = activeDocs.filter(d => d.isMandatory).length;
                      const mandDone = docs.filter(d => d.isMandatory && d.submitted && d.fileName).length;
                      if (submitted === 0) return null;
                      return (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                          <span style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.2)" }}>
                            {submitted} / {activeDocs.length} selected
                          </span>
                          <span style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)" }}>
                            {withFile} uploaded
                          </span>
                          {mandatory > 0 && (
                            <span style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: mandDone === mandatory ? "#059669" : "#D91E18", background: mandDone === mandatory ? "rgba(5,150,105,0.07)" : "rgba(217,30,24,0.07)", border: `1px solid ${mandDone === mandatory ? "rgba(5,150,105,0.2)" : "rgba(217,30,24,0.2)"}` }}>
                              {mandDone} / {mandatory} mandatory
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ TRAINING ══ */}
          {stage === "TRAINING" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-book" title="Training" c1="#7c3aed" c2="#a78bfa" />
              </div>

              <div className="col-md-6">
                <FL required>Training Status</FL>
                <select name="trainingStatus" className="form-select" value={stageData.trainingStatus || ""} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="col-md-6">
                <FL required>Training Start Date</FL>
                <input type="date" name="trainingStart" className="form-control"
                  value={stageData.trainingStart ? new Date(stageData.trainingStart).toISOString().split("T")[0] : ""}
                  onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <FL>Parent Details</FL>
                <input type="text" name="parentsDetails" className="form-control"
                  value={stageData.parentsDetails || ""} onChange={handleChange} placeholder="Parent / guardian name" />
              </div>

              <div className="col-md-6">
                <FL required>Cart Required</FL>
                <select name="cartRequired" className="form-select"
                  value={stageData.cartRequired === true ? "yes" : stageData.cartRequired === false ? "no" : stageData.cartRequired || ""}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {(stageData.cartRequired === "yes" || stageData.cartRequired === true) && (
                <>
                  <div className="col-md-6">
                    <FL>Cart Size</FL>
                    <input type="text" className="form-control" value={stageData.cartSize || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
                  </div>

                  <div className="col-md-6">
                    <FL>Accessories</FL>
                    {(() => {
                      let raw = stageData.accessories;
                      if (raw === undefined && formData?.interestedPackage) {
                        const pkgMaterials = formData?.interestedPackage?.packageMaterials || [];
                        if (pkgMaterials.length > 0) {
                          raw = pkgMaterials.map(m => resolveMaterialName(m)).filter(Boolean).join(", ");
                        } else if (formData?.interestedPackage?.accessories) {
                          raw = formData.interestedPackage.accessories;
                        }
                      }
                      const selectedNames = typeof raw === "string"
                        ? raw.split(",").map(s => resolveMaterialName(s)).filter(Boolean)
                        : Array.isArray(raw) ? raw.map(m => resolveMaterialName(m)).filter(Boolean) : [];

                      const selectedVal = selectedNames.map(name => {
                        const found = materialOptions.find(o => o.value.toLowerCase() === name.toLowerCase());
                        return found || { value: name, label: name };
                      });

                      return (
                        <Select
                          isMulti
                          isClearable
                          styles={customSelectStyles}
                          options={materialOptions}
                          value={selectedVal}
                          isDisabled={isLocked}
                          placeholder="Select Accessories / Materials"
                          onChange={(selected) => {
                            const newString = (selected || []).map(o => o.value).join(", ");
                            const currentStage = stages[activeStage];
                            setFormData(prev => ({
                              ...prev,
                              stages: {
                                ...prev.stages,
                                [currentStage]: {
                                  ...prev.stages[currentStage],
                                  data: {
                                    ...prev.stages[currentStage].data,
                                    accessories: newString,
                                  },
                                },
                              },
                            }));
                          }}
                        />
                      );
                    })()}
                  </div>

                  <div className="col-md-6">
                    <FL required>Required Date</FL>
                    <input type="date" name="cartRequiredDate" className="form-control"
                      value={stageData.cartRequiredDate ? new Date(stageData.cartRequiredDate).toISOString().split("T")[0] : ""}
                      onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <FL required>Priority</FL>
                    <select name="cartPriority" className="form-select" value={stageData.cartPriority || ""} onChange={handleChange}>
                      <option value="">Select</option>
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <FL>Cart Manufacture Status</FL>
                    <input type="text" className="form-control"
                      value={formatLabel(stageData.cartManufactureStatus) || "Not Required"}
                      readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
                  </div>
                </>
              )}
            </>
          )}

          {/* ══ PAYMENT ══ */}
          {stage === "PAYMENT" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-credit-card" title="Payment" c1="#059669" c2="#34d399" />
              </div>

              {/* ── Pay Later toggle ── */}
              <div className="col-12">
                <label
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${stageData.payLater ? "rgba(249,115,22,0.4)" : "#e5e7eb"}`, background: stageData.payLater ? "rgba(249,115,22,0.05)" : "#fafafa", cursor: "pointer", transition: "all 0.2s", userSelect: "none" }}
                >
                  <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
                    <input
                      type="checkbox"
                      checked={!!stageData.payLater}
                      onChange={e => setFormData(prev => ({ ...prev, stages: { ...prev.stages, PAYMENT: { ...prev.stages.PAYMENT, data: { ...prev.stages.PAYMENT.data, payLater: e.target.checked } } } }))}
                      disabled={isLocked}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                    <div style={{ width: 42, height: 24, borderRadius: 12, background: stageData.payLater ? "linear-gradient(135deg,#D91E18,#F97316)" : "#d1d5db", transition: "background 0.25s", display: "flex", alignItems: "center", padding: "0 3px" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transform: stageData.payLater ? "translateX(18px)" : "translateX(0)", transition: "transform 0.25s" }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: stageData.payLater ? "#D91E18" : "#374151" }}>
                      Pay Later
                    </div>
                    <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                      {stageData.payLater
                        ? "Process can be marked complete without full payment. Payment can still be collected later."
                        : "Enable to allow completing this process before full payment is received."}
                    </div>
                  </div>
                </label>

                {stageData.payLater && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.22)" }}>
                    <i className="bx bx-info-circle" style={{ color: "#F97316", fontSize: 18, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>
                      Pay Later is active — this process can proceed with a pending balance. Ensure payment is collected from the customer.
                    </span>
                  </div>
                )}
              </div>

              {/* Summary strip */}
              <div className="col-12">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "Package Amount", val: packageData.price || 0, color: "#374151" },
                    { label: "Total Payable", val: totalAmount, color: "#1A1A1A" },
                    { label: "Paid", val: paidAmount, color: "#059669" },
                    { label: "Pending", val: pendingAmount, color: pendingAmount > 0 ? "#D91E18" : "#059669" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ flex: "1 1 120px", padding: "10px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                      <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color }}>₹{Number(val || 0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Read-only info */}
              <div className="col-md-6">
                <FL>GST Percentage</FL>
                <input className="form-control" value={`${packageData.taxPercentage || 0}%`} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              {(formData?.stages?.TRAINING?.data?.cartRequired === "yes" || formData?.stages?.TRAINING?.data?.cartRequired === true) && (
                <div className="col-md-6">
                  <FL>Cart Amount</FL>
                  <input className="form-control" value={packageData.cartAmount || 0} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
                </div>
              )}

              <div className="col-md-6">
                <FL>Advance Amount</FL>
                <input className="form-control" value={packageData.advanceAmount || 0} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FL>Royalty</FL>
                <input className="form-control"
                  value={packageData.royaltyType === "PERCENTAGE" ? `${packageData.royaltyValue}%` : `₹ ${packageData.royaltyValue}`}
                  readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              {/* Add payment form */}
              {!isFullyPaid && (
                <>
                  <div className="col-md-4">
                    <FL required>Amount</FL>
                    <input type="number" className="form-control" value={stageData.tempAmount || ""} placeholder={`Max ₹${pendingAmount.toLocaleString()}`}
                      onChange={e => setFormData(prev => ({ ...prev, stages: { ...prev.stages, PAYMENT: { ...prev.stages.PAYMENT, data: { ...prev.stages.PAYMENT.data, tempAmount: e.target.value } } } }))} />
                  </div>

                  <div className="col-md-4">
                    <FL required>Date</FL>
                    <input type="date" className="form-control" value={stageData.tempDate || ""}
                      onChange={e => setFormData(prev => ({ ...prev, stages: { ...prev.stages, PAYMENT: { ...prev.stages.PAYMENT, data: { ...prev.stages.PAYMENT.data, tempDate: e.target.value } } } }))} />
                  </div>

                  <div className="col-md-4">
                    <FL required>Payment Mode</FL>
                    <select className="form-select" value={stageData.tempPaymentMode || ""}
                      onChange={e => setFormData(prev => ({ ...prev, stages: { ...prev.stages, PAYMENT: { ...prev.stages.PAYMENT, data: { ...prev.stages.PAYMENT.data, tempPaymentMode: e.target.value } } } }))}>
                      <option value="">Select Mode</option>
                      {paymentModes?.length > 0
                        ? paymentModes.map(m => <option key={m._id} value={m._id}>{m.paymentName}</option>)
                        : <option disabled>No modes</option>}
                    </select>
                  </div>

                  <div className="col-12">
                    <button type="button"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 3px 10px rgba(5,150,105,0.25)" }}
                      onClick={() => {
                        if (!stageData.tempAmount || !stageData.tempDate || !stageData.tempPaymentMode) {
                          toast.error("Fill all payment fields"); return;
                        }
                        const entered = Number(stageData.tempAmount);
                        if (entered > pendingAmount) { toast.error("Amount exceeds pending amount"); return; }
                        const newPay = { amount: entered, date: stageData.tempDate, paymentMode: stageData.tempPaymentMode };
                        setFormData(prev => ({
                          ...prev,
                          stages: {
                            ...prev.stages,
                            PAYMENT: {
                              ...prev.stages.PAYMENT,
                              data: {
                                ...prev.stages.PAYMENT.data,
                                payments: [...(prev.stages.PAYMENT.data.payments || []), newPay],
                                tempAmount: "", tempDate: "", tempPaymentMode: "",
                                paidAmount: paidAmount + entered,
                                pendingAmount: Math.max(totalAmount - (paidAmount + entered), 0),
                              },
                            },
                          },
                        }));
                      }}>
                      <i className="bx bx-plus-circle" style={{ fontSize: 16 }} /> Add Payment
                    </button>
                  </div>
                </>
              )}

              {isFullyPaid && (
                <div className="col-12">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                    <i className="bx bx-check-circle" style={{ color: "#059669", fontSize: 22 }} />
                    <span style={{ fontSize: 14, color: "#059669", fontWeight: 700 }}>Payment fully collected.</span>
                  </div>
                </div>
              )}

              {/* Payment history */}
              {stageData.payments?.length > 0 && (
                <div className="col-12">
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Payment History</div>
                  <div className="table-responsive">
                    <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                      <thead className="table-light">
                        <tr><th style={{ width: 50 }}>#</th><th>Date</th><th>Amount</th><th>Mode</th></tr>
                      </thead>
                      <tbody>
                        {stageData.payments.map((p, i) => (
                          <tr key={i}>
                            <td style={{ color: "#6b7280" }}>{i + 1}</td>
                            <td style={{ color: "#6b7280", fontSize: 13 }}>{p.date ? new Date(p.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                            <td><strong style={{ color: "#059669" }}>₹{Number(p.amount || 0).toLocaleString()}</strong></td>
                            <td style={{ fontSize: 13 }}>{paymentModes?.find(m => String(m._id) === String(p.paymentMode))?.paymentName || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ FINAL SETUP ══ */}
          {stage === "FINAL_SETUP" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-store" title="Contract & Documents" c1="#d97706" c2="#fbbf24" />
              </div>

              <div className="col-md-6">
                <FL required>Contract Signed</FL>
                <select name="contractSigned" className="form-select" value={stageData.contractSigned || ""} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="col-md-6">
                <FL required>KYC Document</FL>
                <input type="file" name="kycDocument" className="form-control"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      setFormData(prev => ({
                        ...prev,
                        stages: {
                          ...prev.stages,
                          FINAL_SETUP: {
                            ...prev.stages.FINAL_SETUP,
                            data: {
                              ...prev.stages.FINAL_SETUP.data,
                              kycDocument: evt.target.result,
                              kycDocumentName: file.name
                            }
                          }
                        }
                      }));
                    };
                    reader.readAsDataURL(file);
                  }} />
                {stageData.kycDocumentName && (
                  <div className="mt-2">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.22)" }}>
                      <i className="bx bx-check-circle" style={{ fontSize: 14 }} />{stageData.kycDocumentName}
                    </span>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <FL required>Bank Account Number</FL>
                <input type="text" name="bankDetails" className="form-control"
                  value={stageData.bankDetails || ""} onChange={handleChange} placeholder="Account / IFSC details" />
              </div>

              <div className="col-md-6">
                <FL required>Bank Account Holder Name</FL>
                <input type="text" name="bankAccountHolderName" className="form-control"
                  value={stageData.bankAccountHolderName || ""} onChange={handleChange} placeholder="Account Holder Name" />
              </div>

              <div className="col-md-6">
                <FL required>Bank Name</FL>
                <input type="text" name="bankName" className="form-control"
                  value={stageData.bankName || ""} onChange={handleChange} placeholder="Bank Name" />
              </div>

              <div className="col-md-6">
                <FL required>Bank IFSC Code</FL>
                <input type="text" name="bankIfscCode" className="form-control"
                  value={stageData.bankIfscCode || ""} onChange={handleChange} placeholder="IFSC Code" />
              </div>

              <div className="col-md-6">
                <FL>Draft Amount</FL>
                <input type="number" name="draftAmount" className="form-control"
                  value={stageData.draftAmount || ""} onChange={handleChange} placeholder="Draft Amount" />
              </div>

              <div className="col-md-6">
                <FL>E-Way Bill</FL>
                <input type="file" name="ewayBillFile" className="form-control"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      setFormData(prev => ({
                        ...prev,
                        stages: {
                          ...prev.stages,
                          FINAL_SETUP: {
                            ...prev.stages.FINAL_SETUP,
                            data: {
                              ...prev.stages.FINAL_SETUP.data,
                              ewayBillFile: evt.target.result,
                              ewayBillFileName: file.name
                            }
                          }
                        }
                      }));
                    };
                    reader.readAsDataURL(file);
                  }} />
                {stageData.ewayBillFileName && (
                  <div className="mt-2">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.22)" }}>
                      <i className="bx bx-check-circle" style={{ fontSize: 14 }} />{stageData.ewayBillFileName}
                    </span>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <FL required>Royalty Document</FL>
                <input type="file" name="royaltyDocument" className="form-control"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      setFormData(prev => ({
                        ...prev,
                        stages: {
                          ...prev.stages,
                          FINAL_SETUP: {
                            ...prev.stages.FINAL_SETUP,
                            data: {
                              ...prev.stages.FINAL_SETUP.data,
                              royaltyDocument: evt.target.result,
                              royaltyDocumentName: file.name
                            }
                          }
                        }
                      }));
                    };
                    reader.readAsDataURL(file);
                  }} />
                {stageData.royaltyDocumentName && (
                  <div className="mt-2">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.22)" }}>
                      <i className="bx bx-check-circle" style={{ fontSize: 14 }} />{stageData.royaltyDocumentName}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LeadStageForm;
