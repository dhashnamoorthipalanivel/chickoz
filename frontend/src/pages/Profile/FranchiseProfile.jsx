import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import { getFranchiseProfile } from "../../api/franchiseApi";
import { changePasswordApi } from "../../api/authAPI";

const API_BASE = "http://localhost:3000";

const getFileUrl = (fileName) => {
  if (!fileName) return "";
  if (fileName.startsWith("http") || fileName.startsWith("data:")) return fileName;
  if (fileName.startsWith("/uploads")) return `${API_BASE}${fileName}`;
  return `${API_BASE}/uploads/${fileName}`;
};

const PasswordStrength = ({ password }) => {
  let score = 0;
  if (!password) return null;
  if (password.length > 5) score += 1;
  if (password.length > 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let strength = "Weak";
  let color = "#ef4444";
  let pct = "33%";
  if (score >= 4) {
    strength = "Strong";
    color = "#22c55e";
    pct = "100%";
  } else if (score >= 2) {
    strength = "Medium";
    color = "#eab308";
    pct = "66%";
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
        <span>Password Strength</span>
        <span style={{ color }}>{strength}</span>
      </div>
      <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct, background: color, transition: "all 0.3s" }} />
      </div>
    </div>
  );
};

const FranchiseProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  // Password State
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getFranchiseProfile(id);
      setProfile(res.data.profile);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = (e) => setPassForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setPassLoading(true);
    try {
      await changePasswordApi({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      toast.success("Password updated successfully!");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!profile) return <div className="text-center py-5 text-muted">Profile not found.</div>;

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* ── Header ── */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0 font-size-18">My Profile</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">My Profile</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* ── Left Column: Basic Info & Pass Reset ── */}
          <div className="col-xl-4 col-lg-5">
            <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center" style={{ padding: "30px 20px" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #D91E18, #F97316)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, margin: "0 auto 16px", boxShadow: "0 4px 14px rgba(217,30,24,0.3)" }}>
                  {profile.franchiseName?.charAt(0) || "F"}
                </div>
                <h5 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{profile.franchiseName}</h5>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{profile.franchiseId}</p>
                <span className={`badge ${profile.status === "ACTIVE" ? "bg-success" : "bg-danger"}`} style={{ padding: "6px 12px", borderRadius: 20 }}>
                  {profile.status}
                </span>
              </div>

              <div className="card-body border-top" style={{ padding: 24 }}>
                <h6 style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>Contact & Package</h6>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><span style={{ fontSize: 11.5, color: "#9ca3af", display: "block" }}>Owner Name</span><strong style={{ fontSize: 13.5, color: "#374151" }}>{profile.ownerName || "—"}</strong></div>
                  <div><span style={{ fontSize: 11.5, color: "#9ca3af", display: "block" }}>Manager</span><strong style={{ fontSize: 13.5, color: "#374151" }}>{profile.manager || "—"}</strong></div>
                  <div><span style={{ fontSize: 11.5, color: "#9ca3af", display: "block" }}>Phone</span><strong style={{ fontSize: 13.5, color: "#374151" }}>{profile.contact || "—"}</strong></div>
                  <div><span style={{ fontSize: 11.5, color: "#9ca3af", display: "block" }}>Email</span><strong style={{ fontSize: 13.5, color: "#374151" }}>{profile.email || "—"}</strong></div>
                  <div><span style={{ fontSize: 11.5, color: "#9ca3af", display: "block" }}>Package</span><strong style={{ fontSize: 13.5, color: "#D91E18" }}>{profile.packageName || "—"}</strong></div>
                </div>
              </div>

              {/* Password Reset */}
              <div className="card-body border-top" style={{ padding: 24, background: "#fafafa", borderRadius: "0 0 16px 16px" }}>
                <h6 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}><i className="bx bx-lock-alt text-primary me-2" />Change Password</h6>
                <form onSubmit={handlePassSubmit}>
                  <div className="mb-3 position-relative">
                    <input type={showPass ? "text" : "password"} name="currentPassword" value={passForm.currentPassword} onChange={handlePassChange} className="form-control" placeholder="Current Password" required style={{ fontSize: 13, paddingRight: 40 }} />
                    <i className={`bx ${showPass ? 'bx-hide' : 'bx-show'} position-absolute`} onClick={() => setShowPass(!showPass)} style={{ top: "50%", right: 12, transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", fontSize: 18 }} />
                  </div>
                  <div className="mb-3 position-relative">
                    <input type={showPass ? "text" : "password"} name="newPassword" value={passForm.newPassword} onChange={handlePassChange} className="form-control" placeholder="New Password" required style={{ fontSize: 13, paddingRight: 40 }} />
                    <i className={`bx ${showPass ? 'bx-hide' : 'bx-show'} position-absolute`} onClick={() => setShowPass(!showPass)} style={{ top: "18px", right: 12, transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", fontSize: 18 }} />
                    <PasswordStrength password={passForm.newPassword} />
                  </div>
                  <div className="mb-3 position-relative">
                    <input type={showPass ? "text" : "password"} name="confirmPassword" value={passForm.confirmPassword} onChange={handlePassChange} className="form-control" placeholder="Confirm New Password" required style={{ fontSize: 13, paddingRight: 40 }} />
                    <i className={`bx ${showPass ? 'bx-hide' : 'bx-show'} position-absolute`} onClick={() => setShowPass(!showPass)} style={{ top: "50%", right: 12, transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280", fontSize: 18 }} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={passLoading} style={{ fontSize: 13, fontWeight: 600 }}>
                    {passLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── Right Column: Map, Docs, Images ── */}
          <div className="col-xl-8 col-lg-7">
            {/* Map */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 16, overflow: "hidden" }}>
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                <h5 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}><i className="bx bx-map text-danger me-2" />Location Map</h5>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{profile.address || profile.location || "Location not specified"}</p>
              </div>
              <div className="card-body p-0">
                {profile.latitude && profile.longitude ? (
                  <div style={{ height: 300, width: "100%" }}>
                    <MapContainer center={[profile.latitude, profile.longitude]} zoom={14} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                      <Marker position={[profile.latitude, profile.longitude]}>
                        <Popup>{profile.franchiseName}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: 300, color: "#9ca3af" }}>
                    <div className="text-center">
                      <i className="bx bx-map-pin display-4 d-block mb-2 text-muted" />
                      Coordinates not available
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              {/* Documents */}
              <div className="col-md-6">
                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 16, height: "100%" }}>
                  <div className="card-body">
                    <h5 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}><i className="bx bx-file text-info me-2" />Uploaded Documents</h5>
                    {profile.documents?.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {profile.documents.map((d, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid #f0f0f0", borderRadius: 8, background: "#fbfbfb" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <i className="bx bxs-file-pdf" style={{ fontSize: 20, color: "#D91E18" }} />
                              <div>
                                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{d.documentName}</div>
                                {d.fileData || d.fileName ? (
                                  <a href={d.fileData || getFileUrl(d.fileName)} download={d.fileName || "document"} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#2563EB", textDecoration: "none" }}><i className="bx bx-download me-1" />Download</a>
                                ) : (
                                  <span style={{ fontSize: 11, color: "#ef4444" }}>Not Uploaded</span>
                                )}
                              </div>
                            </div>
                            {d.submitted && <i className="bx bx-check-circle text-success" style={{ fontSize: 18 }} />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted font-size-13 text-center py-4">No documents uploaded.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Images & Accessories */}
              <div className="col-md-6">
                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 16, height: "100%" }}>
                  <div className="card-body">
                    <h5 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}><i className="bx bx-image text-warning me-2" />Cart Images & Accessories</h5>
                    
                    <div style={{ marginBottom: 20 }}>
                      <span style={{ fontSize: 11.5, color: "#9ca3af", display: "block", marginBottom: 4 }}>Accessories Details</span>
                      <div style={{ padding: 12, background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 8, fontSize: 13, color: "#374151", minHeight: 60 }}>
                        {profile.accessories || <span className="text-muted font-style-italic">No accessories listed.</span>}
                      </div>
                    </div>

                    <span style={{ fontSize: 11.5, color: "#9ca3af", display: "block", marginBottom: 8 }}>Cart Images & Videos</span>
                    {profile.cartImages?.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {profile.cartImages.map((img, i) => {
                          const isVideo = img.match(/\.(mp4|webm|ogg|mov)$/i);
                          return (
                            <div 
                              key={i} 
                              onClick={() => setLightbox({ src: getFileUrl(img), isVideo })}
                              style={{ width: 70, height: 70, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: "1px solid #e5e7eb", position: "relative" }}
                            >
                              {isVideo ? (
                                <video src={getFileUrl(img)} style={{ width: "100%", height: "100%", objectFit: "cover", background: "#f3f4f6" }} />
                              ) : (
                                <img src={getFileUrl(img)} alt="Cart" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              )}
                              {isVideo && (
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                                  <i className="bx bx-play-circle" style={{ fontSize: 24, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.4)" }} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted font-size-13 text-center py-3 bg-light rounded">No images or videos uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setLightbox(null)}>
          <button style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer" }} onClick={() => setLightbox(null)}>&times;</button>
          {lightbox.isVideo ? (
            <video src={lightbox.src} controls autoPlay style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()} />
          ) : (
            <img src={lightbox.src} alt="Preview" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()} />
          )}
        </div>
      )}

    </div>
  );
};

export default FranchiseProfile;
