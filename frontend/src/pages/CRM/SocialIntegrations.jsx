import React, { useEffect, useState } from "react";
import * as Feather from "react-feather";
import { useIntegrationStore } from "../../store/store";
import { toast } from "react-toastify";

const SocialIntegrations = () => {
  const { integrations, fetchIntegrations, configureIntegration, loading } = useIntegrationStore();
  
  const [showModal, setShowModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [formData, setFormData] = useState({ verifyToken: "", accessToken: "", pageId: "", isActive: true });

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fbIntegration = integrations.find(i => i.platform === "FACEBOOK");
  const igIntegration = integrations.find(i => i.platform === "INSTAGRAM");
  const googleIntegration = integrations.find(i => i.platform === "GOOGLE");

  const openConfig = (platform, existingData) => {
    setCurrentPlatform(platform);
    if (existingData) {
      setFormData({
        verifyToken: existingData.verifyToken || "",
        accessToken: existingData.accessToken || "",
        pageId: existingData.pageId || "",
        isActive: existingData.isActive !== undefined ? existingData.isActive : true
      });
    } else {
      setFormData({ verifyToken: "", accessToken: "", pageId: "", isActive: true });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await configureIntegration({
        platform: currentPlatform,
        ...formData
      });
      toast.success(`${currentPlatform} integration saved!`);
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save integration");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center page-title-box">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather.Share2 size={22} color="#fff" />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Integrations</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>CRM · Social Media</div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
           <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : (
        <div className="row">
          {/* Facebook Lead Ads */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className={`card shadow-sm border-0 h-100 ${fbIntegration?.isActive ? '' : 'opacity-75'}`}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded me-3">
                    <Feather.Facebook size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Facebook Lead Ads</h5>
                    <small className="text-muted">Capture leads directly from Facebook campaigns</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  {fbIntegration?.isActive ? (
                    <span className="badge bg-soft-success text-success">Connected</span>
                  ) : (
                    <span className="badge bg-light text-muted">Not Connected</span>
                  )}
                  <button onClick={() => openConfig("FACEBOOK", fbIntegration)} className="btn btn-sm btn-outline-primary">
                    {fbIntegration ? "Configure" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instagram Ads */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className={`card shadow-sm border-0 h-100 ${igIntegration?.isActive ? '' : 'opacity-75'}`}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger bg-opacity-10 text-danger p-3 rounded me-3">
                    <Feather.Instagram size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Instagram Ads</h5>
                    <small className="text-muted">Import leads from Instagram promotions</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  {igIntegration?.isActive ? (
                    <span className="badge bg-soft-success text-success">Connected</span>
                  ) : (
                    <span className="badge bg-light text-muted">Not Connected</span>
                  )}
                  <button onClick={() => openConfig("INSTAGRAM", igIntegration)} className="btn btn-sm btn-outline-danger">
                    {igIntegration ? "Configure" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Google Ads */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm border-0 h-100 opacity-75">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 text-warning p-3 rounded me-3">
                    <Feather.Search size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Google Ads</h5>
                    <small className="text-muted">Sync leads from Google Search and Display network</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  {googleIntegration?.isActive ? (
                    <span className="badge bg-soft-success text-success">Connected</span>
                  ) : (
                    <span className="badge bg-light text-muted">Not Connected</span>
                  )}
                  <button onClick={() => openConfig("GOOGLE", googleIntegration)} className="btn btn-sm btn-outline-warning">
                    {googleIntegration ? "Configure" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1045 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{currentPlatform} Configuration</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">{currentPlatform === "GOOGLE" ? "Google Key" : "Verify Token"}</label>
                    <input type="text" className="form-control" name="verifyToken" value={formData.verifyToken} onChange={handleChange} placeholder={currentPlatform === "GOOGLE" ? "Custom string for Google Ads webhook key" : "Custom string for webhook verification"} />
                  </div>
                  {currentPlatform !== "GOOGLE" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Page Access Token</label>
                        <input type="text" className="form-control" name="accessToken" value={formData.accessToken} onChange={handleChange} placeholder="Facebook/Instagram Page Access Token" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Page ID</label>
                        <input type="text" className="form-control" name="pageId" value={formData.pageId} onChange={handleChange} placeholder="Facebook/Instagram Page ID" />
                      </div>
                    </>
                  )}
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                    <label className="form-check-label">Is Active</label>
                  </div>
                  
                  <div className="alert alert-info mt-3" style={{ fontSize: '0.85rem' }}>
                    <strong>Webhook URL:</strong><br/>
                    <code>{window.location.origin.replace("5173", "5000")}/api/raw-leads/webhook</code>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>Save Configuration</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialIntegrations;
