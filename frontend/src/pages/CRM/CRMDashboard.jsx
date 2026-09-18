import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as Feather from "react-feather";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const CRMDashboard = () => {
  const [stats, setStats] = useState({
    socialLeads: 0,
    enquiries: 0,
    convertedToLead: 0,
    convertedToFranchise: 0,
    socialLeadsByPlatform: {}
  });
  const [pipeline, setPipeline] = useState({
    LEAD: [], CONTACTED: [], PROPOSAL: [], NEGOTIATION: [], WON: [], LOST: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pipelineRes] = await Promise.all([
        axios.get(`${API_URL}/crm/dashboard-stats`, getHeaders()),
        axios.get(`${API_URL}/crm/pipeline`, getHeaders())
      ]);
      setStats(statsRes.data);
      setPipeline(pipelineRes.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  const conversionRate = stats.enquiries > 0 ? Math.round((stats.convertedToLead / stats.enquiries) * 100) : 0;

  // Chart Data: Macro Funnel
  const funnelChartOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true, distributed: true } },
    dataLabels: { enabled: true },
    xaxis: { categories: ['Social Leads', 'Enquiries', 'Leads'] },
    colors: ['#3b82f6', '#f59e0b', '#8b5cf6'],
  };

  const funnelChartSeries = [{
    name: 'Volume',
    data: [
      stats.socialLeads,
      stats.enquiries,
      stats.convertedToLead
    ]
  }];

  // Chart Data: Conversion Overview Donut
  const donutChartOptions = {
    chart: { type: 'donut' },
    labels: ['Leads (Converted)', 'Enquiries (Initial)'],
    colors: ['#8b5cf6', '#f59e0b'],
    legend: { position: 'bottom' }
  };

  const donutChartSeries = [
    stats.convertedToLead,
    Math.max(0, stats.enquiries - stats.convertedToLead)
  ];

  // -------------------------
  // CRM Pipeline Metrics
  // -------------------------
  const totalCrmLeads = Object.values(pipeline).reduce((acc, stage) => acc + stage.length, 0);
  const wonCrmLeads = pipeline.WON.length;
  const lostCrmLeads = pipeline.LOST.length;

  const crmStageChartOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false, distributed: true } },
    dataLabels: { enabled: true },
    xaxis: { categories: ['New Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'] },
    colors: ['#3b82f6', '#0ea5e9', '#f59e0b', '#64748b', '#22c55e', '#ef4444'],
  };

  const crmStageChartSeries = [{
    name: 'Leads',
    data: [
      pipeline.LEAD.length, 
      pipeline.CONTACTED.length, 
      pipeline.PROPOSAL.length, 
      pipeline.NEGOTIATION.length, 
      pipeline.WON.length, 
      pipeline.LOST.length
    ]
  }];

  const crmDonutChartOptions = {
    chart: { type: 'donut' },
    labels: ['Won', 'Lost', 'In Progress'],
    colors: ['#22c55e', '#ef4444', '#f59e0b'],
    legend: { position: 'bottom' }
  };

  const crmInProgress = totalCrmLeads - wonCrmLeads - lostCrmLeads;
  const crmDonutChartSeries = [wonCrmLeads, lostCrmLeads, Math.max(0, crmInProgress)];

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center page-title-box">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather.PieChart size={22} color="#fff" />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>CRM Analytics</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>Overview & Insights</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="row">
          <div className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted fw-medium mb-1">Social Leads</p>
                    <h3 className="mb-0 fw-bold">{stats.socialLeads}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded">
                    <Feather.Share2 size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted fw-medium mb-1">Enquiries</p>
                    <h3 className="mb-0 fw-bold">{stats.enquiries}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 text-warning p-3 rounded">
                    <Feather.MessageSquare size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted fw-medium mb-1">Leads (Converted)</p>
                    <h3 className="mb-0 fw-bold">{stats.convertedToLead}</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 text-info p-3 rounded">
                    <Feather.Users size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Conversion Funnel</h5>
                <ReactApexChart options={funnelChartOptions} series={funnelChartSeries} type="bar" height={350} />
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Pipeline Distribution</h5>
                <ReactApexChart options={donutChartOptions} series={donutChartSeries} type="donut" height={320} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Social Leads By Platform</h5>
                <ReactApexChart 
                  options={{
                    chart: { type: 'pie' },
                    labels: ['Facebook', 'Instagram', 'Google', 'Other'],
                    colors: ['#1877f2', '#E1306C', '#DB4437', '#9CA3AF'],
                    legend: { position: 'bottom' }
                  }} 
                  series={[
                    stats.socialLeadsByPlatform?.FACEBOOK || 0,
                    stats.socialLeadsByPlatform?.INSTAGRAM || 0,
                    stats.socialLeadsByPlatform?.GOOGLE || 0,
                    stats.socialLeadsByPlatform?.OTHER || 0
                  ]} 
                  type="pie" 
                  height={320} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* CRM Pipeline Charts */}
        <div className="row mb-4">
          <div className="col-12 mt-3">
            <h5 className="fw-bold mb-3" style={{ color: "#1A1A1A" }}>CRM Pipeline Dynamics</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Pipeline Stage Distribution</h5>
                <ReactApexChart options={crmStageChartOptions} series={crmStageChartSeries} type="bar" height={350} />
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Win / Loss Ratio</h5>
                <ReactApexChart options={crmDonutChartOptions} series={crmDonutChartSeries} type="donut" height={320} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CRMDashboard;
