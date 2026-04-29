import React from 'react';

const Dropdowns = () => {
  const variants = ['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'];

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Dropdowns</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Components</a></li>
                <li className="breadcrumb-item active">Dropdowns</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Single button dropdowns</h4>
              <p className="card-title-desc">Any single <code>.btn</code> can be turned into a dropdown toggle with some markup changes.</p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      Dropdown button <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a className="dropdown-item" href="#!">Action</a>
                      <a className="dropdown-item" href="#!">Another action</a>
                      <a className="dropdown-item" href="#!">Something else here</a>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="dropdown mt-4 mt-sm-0">
                    <a href="#!" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Dropdown link <i className="mdi mdi-chevron-down"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="#!">Action</a>
                      <a className="dropdown-item" href="#!">Another action</a>
                      <a className="dropdown-item" href="#!">Something else here</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Variant</h4>
              <p className="card-title-desc">The best part is you can do this with any button variant, too:</p>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                {variants.map((v, i) => (
                  <div className="btn-group" key={i}>
                    <button type="button" className={`btn btn-${v.toLowerCase()} dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                      {v} <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="#!">Action</a>
                      <a className="dropdown-item" href="#!">Another action</a>
                      <a className="dropdown-item" href="#!">Something else here</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#!">Separated link</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dropdowns;
