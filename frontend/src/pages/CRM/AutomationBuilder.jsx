import React from "react";
import * as Feather from "react-feather";

const AutomationBuilder = () => {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center page-title-box">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather.Zap size={22} color="#fff" />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Automation Builder</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>CRM · Workflows</div>
              </div>
            </div>
            <button className="btn btn-primary shadow-sm" style={{ display: "flex", alignItems: "center" }}>
              <Feather.Plus size={16} className="me-1" /> New Workflow
            </button>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12 text-center py-5">
            <Feather.Settings size={48} className="text-muted mb-3" />
            <h4 className="fw-bold">Automation Engine</h4>
            <p className="text-muted">Visual workflow builder coming soon. This feature is under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationBuilder;
