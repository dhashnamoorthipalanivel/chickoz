import React from 'react';

const Carousel = () => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Carousel</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Components</a></li>
                <li className="breadcrumb-item active">Carousel</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Slides only</h4>
              <p className="card-title-desc">Here’s a carousel with slides only. Note the presence of the <code>.d-block</code> and <code>.img-fluid</code> on carousel images to prevent browser default image alignment.</p>
            </div>
            <div className="card-body">
              <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-1.jpg" alt="First slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-2.jpg" alt="Second slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-3.jpg" alt="Third slide" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">With Controls</h4>
              <p className="card-title-desc">Adding in the previous and next controls.</p>
            </div>
            <div className="card-body">
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-4.jpg" alt="First slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-5.jpg" alt="Second slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-6.jpg" alt="Third slide" />
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">With indicators</h4>
              <p className="card-title-desc">You can also add the indicators to the carousel, alongside the controls, too.</p>
            </div>
            <div className="card-body">
              <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></li>
                  <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
                  <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
                </ol>
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-3.jpg" alt="First slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-2.jpg" alt="Second slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block img-fluid mx-auto" src="/assets/images/small/img-1.jpg" alt="Third slide" />
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">With captions</h4>
              <p className="card-title-desc">Add captions to your slides easily with the <code>.carousel-caption</code> element within any <code>.carousel-item</code>.</p>
            </div>
            <div className="card-body">
              <div id="carouselExampleCaption" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active">
                    <img src="/assets/images/small/img-7.jpg" alt="..." className="d-block img-fluid mx-auto" />
                    <div className="carousel-caption d-none d-md-block text-white-50">
                      <h5 className="text-white">First slide label</h5>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img src="/assets/images/small/img-5.jpg" alt="..." className="d-block img-fluid mx-auto" />
                    <div className="carousel-caption d-none d-md-block text-white-50">
                      <h5 className="text-white">Second slide label</h5>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img src="/assets/images/small/img-4.jpg" alt="..." className="d-block img-fluid mx-auto" />
                    <div className="carousel-caption d-none d-md-block text-white-50">
                      <h5 className="text-white">Third slide label</h5>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleCaption" role="button" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleCaption" role="button" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Carousel;
