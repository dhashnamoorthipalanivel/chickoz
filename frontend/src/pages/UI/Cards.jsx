import React from 'react';

const Cards = () => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Cards</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Components</a></li>
                <li className="breadcrumb-item active">Cards</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <img className="card-img-top img-fluid" src="/assets/images/small/img-1.jpg" alt="Card image cap" />
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#!" className="btn btn-primary waves-effect waves-light">Button</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <img className="card-img-top img-fluid" src="/assets/images/small/img-2.jpg" alt="Card image cap" />
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Cras justo odio</li>
              <li className="list-group-item">Dapibus ac facilisis in</li>
            </ul>
            <div className="card-body">
              <a href="#!" className="card-link">Card link</a>
              <a href="#!" className="card-link">Another link</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <img className="card-img-top img-fluid" src="/assets/images/small/img-3.jpg" alt="Card image cap" />
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <h6 className="card-subtitle text-muted">Support card subtitle</h6>
            </div>
            <img className="img-fluid" src="/assets/images/small/img-4.jpg" alt="Card image cap" />
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#!" className="card-link">Card link</a>
              <a href="#!" className="card-link">Another link</a>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card bg-primary border-primary text-white-50">
            <div className="card-body">
              <h5 className="mb-3 text-white">Primary Card</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-success border-success text-white-50">
            <div className="card-body">
              <h5 className="mb-3 text-white">Success Card</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-info border-info text-white-50">
            <div className="card-body">
              <h5 className="mb-3 text-white">Info Card</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Cards;
