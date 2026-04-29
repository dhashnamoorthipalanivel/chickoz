import React from 'react';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const miniChart1Options = {
    chart: { type: 'line', height: 50, sparkline: { enabled: true } },
    colors: ['#5156be'],
    stroke: { curve: 'smooth', width: 2 },
    series: [{ data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14] }],
    tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } }, marker: { show: false } }
  };

  return (
    <React.Fragment>
      {/* start page title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Dashboard</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Dashboard</a></li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* end page title */}

      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card card-h-100">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">My Wallet</span>
                  <h4 className="mb-3">$<span className="counter-value">865.2</span>k</h4>
                </div>
                <div className="col-6">
                  <Chart options={miniChart1Options} series={miniChart1Options.series} type="line" height={50} className="apex-charts mb-2" />
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-success-subtle text-success">+$20.9k</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-h-100">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">Number of Trades</span>
                  <h4 className="mb-3"><span className="counter-value">6258</span></h4>
                </div>
                <div className="col-6">
                  <Chart options={miniChart1Options} series={miniChart1Options.series} type="line" height={50} className="apex-charts mb-2" />
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-danger-subtle text-danger">-29 Trades</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-h-100">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">Invested Amount</span>
                  <h4 className="mb-3">$<span className="counter-value">4.32</span>M</h4>
                </div>
                <div className="col-6">
                  <Chart options={miniChart1Options} series={miniChart1Options.series} type="line" height={50} className="apex-charts mb-2" />
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-success-subtle text-success">+ $2.8k</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-h-100">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">Profit Ration</span>
                  <h4 className="mb-3"><span className="counter-value">12.57</span>%</h4>
                </div>
                <div className="col-6">
                  <Chart options={miniChart1Options} series={miniChart1Options.series} type="line" height={50} className="apex-charts mb-2" />
                </div>
              </div>
              <div className="text-nowrap">
                <span className="badge bg-success-subtle text-success">+2.95%</span>
                <span className="ms-1 text-muted font-size-13">Since last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add more sections here like Wallet Balance, Invested Overview, etc. */}
    </React.Fragment>
  );
};

export default Dashboard;
