import React from 'react';

const Colors = () => {
  const colors = [
    { name: 'Primary', class: 'primary' },
    { name: 'Secondary', class: 'secondary' },
    { name: 'Success', class: 'success' },
    { name: 'Info', class: 'info' },
    { name: 'Warning', class: 'warning' },
    { name: 'Danger', class: 'danger' },
    { name: 'Dark', class: 'dark' },
    { name: 'Light', class: 'light' },
  ];

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 font-size-18">Colors</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="#!">Components</a></li>
                <li className="breadcrumb-item active">Colors</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Grid options</h4>
              <p className="card-title-desc">See how aspects of the Bootstrap grid system work across multiple devices with a handy table.</p>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-nowrap align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Colors</th>
                      <th scope="col" colspan="2" className="text-center">Background <br /> Gradient</th>
                      <th scope="col" colspan="2" className="text-center">Background <br /> Color</th>
                      <th scope="col" colspan="2" className="text-center">Border <br /> Colors</th>
                      <th scope="col" colspan="2" className="text-center">Text <br /> Colors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map((color, index) => (
                      <tr key={index}>
                        <th scope="row">{color.name}</th>
                        <td style={{ width: '180px' }}><code>.bg-gradient</code></td>
                        <td style={{ width: '180px' }}><div className={`bg-${color.class} bg-gradient p-2`}></div></td>
                        <td style={{ width: '180px' }}><code>.bg-{color.class}</code></td>
                        <td style={{ width: '180px' }}><div className={`bg-${color.class} p-2`}></div></td>
                        <td style={{ width: '180px' }}><code>.border-{color.class}</code></td>
                        <td style={{ width: '180px' }}><div className={`border border-${color.class} p-2`}></div></td>
                        <td style={{ width: '180px' }}><code>.text-{color.class}</code></td>
                        <td style={{ width: '180px' }}><div className={`text-${color.class}`}>text-{color.class}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Colors;
