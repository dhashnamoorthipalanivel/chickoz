import React from 'react';
import { Link } from 'react-router-dom';
import Chart from "react-apexcharts";

const chartOptions = {
  chart: {
    id: "basic-line"
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May"]
  }
};

const chartSeries = [
  {
    name: "Sales",
    data: [30, 40, 35, 50, 49]
  }
];

export const ChartsApex = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Apex Charts</h4>
                <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                            <Link to="#">Charts</Link>
                            </li>
                            <li className="breadcrumb-item active">Apex Charts</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Line Chart</h4></div>
                        <div className="card-body">
                            <div className="text-center py-5">
                                <Chart
  options={chartOptions}
  series={chartSeries}
  type="line"
  height={300}
/>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Bar Chart</h4></div>
                        <div className="card-body">
                            <div className="text-center py-5"><i className="bx bx-bar-chart display-1 text-muted"></i><p className="text-muted mt-3">Apex Charts ready to implement</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const ChartsEChart = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">E Charts</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Charts</Link></li><li className="breadcrumb-item active">E Charts</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Line Chart</h4></div>
                        <div className="card-body"><div className="text-center py-5"><i className="bx bx-line-chart display-1 text-muted"></i><p className="text-muted mt-3">Install echarts-for-react to enable charts</p><code>npm install echarts-for-react echarts</code></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const ChartsChartjs = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Chartjs Charts</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Charts</Link></li><li className="breadcrumb-item active">Chartjs</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Bar Chart</h4></div>
                        <div className="card-body"><div className="text-center py-5"><i className="bx bx-bar-chart-alt display-1 text-muted"></i><p className="text-muted mt-3">Install react-chartjs-2 to enable charts</p><code>npm install react-chartjs-2 chart.js</code></div></div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Pie Chart</h4></div>
                        <div className="card-body"><div className="text-center py-5"><i className="bx bx-pie-chart display-1 text-muted"></i><p className="text-muted mt-3">Chartjs ready to implement</p></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const ChartsKnob = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Jquery Knob</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Charts</Link></li><li className="breadcrumb-item active">Jquery Knob</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Basic Knob</h4></div>
                        <div className="card-body"><div className="text-center py-5"><div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '8px solid var(--bs-primary)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--bs-primary)' }}>75%</div><p className="mt-3 text-muted">Knob Chart Component</p></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const ChartsSparkline = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Sparkline Charts</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Charts</Link></li><li className="breadcrumb-item active">Sparkline</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-xl-4">
                    <div className="card"><div className="card-body"><h4 className="card-title">Basic Sparkline</h4><div className="text-center py-5"><i className="bx bx-trending-up display-1 text-success"></i><p className="text-muted mt-3">Sparkline Charts</p></div></div></div>
                </div>
            </div>
        </div>
    </div>
);
