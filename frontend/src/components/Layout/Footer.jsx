import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            {new Date().getFullYear()} © Chickoz.
          </div>
          <div className="col-sm-6">
            <div className="text-sm-end d-none d-sm-block">
              Design & Develop by <a href="https://ahattrickz.com/" className="text-decoration-underline">Ahattrickz Info Tech</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
