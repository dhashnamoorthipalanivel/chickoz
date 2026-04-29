import React from 'react';

const Buttons = () => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Buttons</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Components</a></li>
                <li className="breadcrumb-item active">Buttons</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Default Buttons</h4>
              <p className="card-title-desc">Bootstrap includes six predefined button styles, each serving its own semantic purpose.</p>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary waves-effect waves-light">Primary</button>
                <button type="button" className="btn btn-secondary waves-effect waves-light">Secondary</button>
                <button type="button" className="btn btn-success waves-effect waves-light">Success</button>
                <button type="button" className="btn btn-info waves-effect waves-light">Info</button>
                <button type="button" className="btn btn-warning waves-effect waves-light">Warning</button>
                <button type="button" className="btn btn-danger waves-effect waves-light">Danger</button>
                <button type="button" className="btn btn-dark waves-effect waves-light">Dark</button>
                <button type="button" className="btn btn-link waves-effect">Link</button>
                <button type="button" className="btn btn-light waves-effect">Light</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Outline Buttons</h4>
              <p className="card-title-desc">Replace the default modifier classes with the <code>.btn-outline-*</code> ones.</p>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline-primary waves-effect waves-light">Primary</button>
                <button type="button" className="btn btn-outline-secondary waves-effect">Secondary</button>
                <button type="button" className="btn btn-outline-success waves-effect waves-light">Success</button>
                <button type="button" className="btn btn-outline-info waves-effect waves-light">Info</button>
                <button type="button" className="btn btn-outline-warning waves-effect waves-light">Warning</button>
                <button type="button" className="btn btn-outline-danger waves-effect waves-light">Danger</button>
                <button type="button" className="btn btn-outline-dark waves-effect waves-light">Dark</button>
                <button type="button" className="btn btn-outline-light waves-effect">Light</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Rounded Buttons</h4>
              <p className="card-title-desc">Use class <code>.btn-rounded</code> for button round border.</p>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary btn-rounded waves-effect waves-light">Primary</button>
                <button type="button" className="btn btn-secondary btn-rounded waves-effect waves-light">Secondary</button>
                <button type="button" className="btn btn-success btn-rounded waves-effect waves-light">Success</button>
                <button type="button" className="btn btn-info btn-rounded waves-effect waves-light">Info</button>
                <button type="button" className="btn btn-warning btn-rounded waves-effect waves-light">Warning</button>
                <button type="button" className="btn btn-danger btn-rounded waves-effect waves-light">Danger</button>
                <button type="button" className="btn btn-dark btn-rounded waves-effect waves-light">Dark</button>
                <button type="button" className="btn btn-link btn-rounded waves-effect">Link</button>
                <button type="button" className="btn btn-light btn-rounded waves-effect">Light</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Soft Buttons</h4>
              <p className="card-title-desc">Use class <code>.btn-soft-*</code> for soft buttons.</p>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-soft-primary waves-effect waves-light">Primary</button>
                <button type="button" className="btn btn-soft-secondary waves-effect waves-light">Secondary</button>
                <button type="button" className="btn btn-soft-success waves-effect waves-light">Success</button>
                <button type="button" className="btn btn-soft-info waves-effect waves-light">Info</button>
                <button type="button" className="btn btn-soft-warning waves-effect waves-light">Warning</button>
                <button type="button" className="btn btn-soft-danger waves-effect waves-light">Danger</button>
                <button type="button" className="btn btn-soft-dark waves-effect waves-light">Dark</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Buttons;
