import React from 'react';
import { Link } from 'react-router-dom';

const BlogGrid = () => {
  const blogs = [
    { id: 1, title: 'Beautiful Day with Friends', date: '10 Apr, 2022', image: '/assets/images/small/img-3.jpg', desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text, a Latin professor at Hampden-Sydney College.' },
    { id: 2, title: 'Drawing a sketch', date: '24 May, 2022', image: '/assets/images/small/img-2.jpg', desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' },
    { id: 3, title: 'Project discussion with team', date: '12 June, 2022', image: '/assets/images/small/img-1.jpg', desc: 'Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.' },
    { id: 4, title: 'Morning with Photoshoot', date: '10 July, 2022', image: '/assets/images/small/img-4.jpg', desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' },
    { id: 5, title: 'Coffee with friends', date: '16 June, 2022', image: '/assets/images/small/img-3.jpg', desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text, a Latin professor at Hampden-Sydney College.' },
    { id: 6, title: 'Working day with our new ideas', date: '22 May, 2022', image: '/assets/images/small/img-5.jpg', desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.' }
  ];

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Blog Grid</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Blog</a></li>
                <li className="breadcrumb-item active">Blog Grid</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="mb-3">
            <h5 className="card-title">Blog List <span className="text-muted fw-normal ms-2">(535)</span></h5>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
            <div>
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <Link className="nav-link" to="/apps-blog-list"><i className="bx bx-list-ul"></i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/apps-blog-grid"><i className="bx bx-grid-alt"></i></Link>
                </li>
              </ul>
            </div>
            <div>
              <a href="#!" className="btn btn-light"><i className="bx bx-plus me-1"></i> Add New</a>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {blogs.map((blog) => (
          <div className="col-xl-4 col-sm-6" key={blog.id}>
            <div className="card">
              <div className="">
                <img src={blog.image} alt="" className="img-fluid" />
              </div>
              <div className="card-body">
                <p className="text-muted mb-2">{blog.date}</p>
                <h5 className=""><Link to="#!" className="text-body">{blog.title}</Link></h5>
                <p className="mb-0 font-size-15">{blog.desc}</p>
                <div className="mt-3">
                  <Link to="#!" className="align-middle font-size-15">Read more <i className="mdi mdi-chevron-right"></i></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-3">
          <ul className="pagination mb-sm-0">
            <li className="page-item disabled"><a href="#!" className="page-link"><i className="mdi mdi-chevron-left"></i></a></li>
            <li className="page-item"><a href="#!" className="page-link">1</a></li>
            <li className="page-item active"><a href="#!" className="page-link">2</a></li>
            <li className="page-item"><a href="#!" className="page-link">3</a></li>
            <li className="page-item"><a href="#!" className="page-link"><i className="mdi mdi-chevron-right"></i></a></li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogGrid;
