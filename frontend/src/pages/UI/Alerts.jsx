import React from 'react';

const Alerts = () => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Alerts</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Components</a></li>
                <li className="breadcrumb-item active">Alerts</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Default Alerts</h4>
              <p className="card-title-desc">Alerts are available for any length of text, as well as an optional dismiss button.</p>
            </div>
            <div className="card-body">
              <div className="alert alert-primary" role="alert">A simple primary alert—check it out!</div>
              <div className="alert alert-secondary" role="alert">A simple secondary alert—check it out!</div>
              <div className="alert alert-success" role="alert">A simple success alert—check it out!</div>
              <div className="alert alert-danger" role="alert">A simple danger alert—check it out!</div>
              <div className="alert alert-warning" role="alert">A simple warning alert—check it out!</div>
              <div className="alert alert-info" role="alert">A simple info alert—check it out!</div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Dismissing</h4>
              <p className="card-title-desc">Add a dismiss button and the <code>.alert-dismissible</code> class.</p>
            </div>
            <div className="card-body">
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                A simple success alert—check it out!
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                A simple danger alert—check it out!
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                A simple warning alert—check it out!
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Alerts;
