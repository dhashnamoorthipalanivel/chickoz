import React, { useEffect, useState } from "react";

const ProductDetailModal = ({ show, onClose, product, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (show) setQty(1);
  }, [show]);

  if (!show || !product) return null;

  const totalPrice = product.price * qty;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <button
              type="button"
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center ms-auto shadow-sm"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: "38px",
                height: "38px",
                border: "1px solid #e9ecef"
              }}
            >
              <i className="bx bx-x fs-4 text-dark"></i>
            </button>
          </div>

          <div className="modal-body pt-0 px-4 pb-4">
            <div className="row g-4">
              <div className="col-md-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded-3 w-100"
                  style={{ height: "220px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-8">
                <h2 className="fw-bold mb-2">{product.name}</h2>

                <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                  <span className="text-muted text-decoration-line-through">
                    ₹ {product.oldPrice}
                  </span>
                  <span className="fs-3 fw-bold">₹ {product.price}</span>
                  <span className="badge bg-danger-subtle text-danger">
                    -₹ {product.oldPrice - product.price}
                  </span>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className="badge bg-light text-dark border">ID #{product.id}</span>
                  <span className="badge bg-light text-dark border">{product.stock}</span>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-4">
                  {product.tags?.map((tag, index) => (
                    <span key={index} className="badge bg-success-subtle text-success">
                      {tag}
                    </span>
                  ))}
                </div>

                <h4 className="fw-semibold mb-2">Description</h4>
                <p className="text-muted">{product.description}</p>
              </div>
            </div>

            <div className="border-top mt-4 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h3 className="fw-bold mb-0">Total Price</h3>
                <div className="fs-1 fw-bold">₹ {totalPrice}</div>
              </div>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-light"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="fs-5 fw-semibold">{qty}</span>
                  <button
                    className="btn btn-light"
                    onClick={() => setQty((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={() => onAddToCart(product, qty)}
                >
                  <i className="bx bx-cart me-2"></i>
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;