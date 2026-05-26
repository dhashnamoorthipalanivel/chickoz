import React, { useEffect, useState } from "react";

const ProductDetailModal = ({
  show,
  onClose,
  product,
  onAddToCart
}) => {

  const [qty, setQty] =
    useState(1);

  const [selectedAddons, setSelectedAddons] =
    useState([]);

  const [selectedCustomizations, setSelectedCustomizations] =
    useState([]);

  const [notes, setNotes] =
    useState("");

  useEffect(() => {

    if (show) {

      setQty(1);

      setSelectedAddons([]);

      setSelectedCustomizations([]);

      setNotes("");
    }

  }, [show]);

  if (!show || !product) return null;

  // =========================
  // PRICE CALCULATION
  // =========================

  const basePrice =
    Number(product.price || 0);

  let discountedPrice =
    basePrice;

  const hasValidOffer =
    product?.hasOffer &&
    Number(product?.offerValue || 0) > 0;

  if (hasValidOffer) {

    if (
      product.offerType === "PERCENTAGE"
    ) {

      discountedPrice =
        basePrice -
        (
          basePrice *
          Number(product.offerValue)
        ) / 100;

    } else {

      discountedPrice =
        basePrice -
        Number(product.offerValue);
    }
  }

  discountedPrice =
    Math.max(0, discountedPrice);

  // =========================
  // ADDON TOTAL
  // =========================

  const addonTotal =
    selectedAddons.reduce(
      (sum, addon) =>
        sum + Number(addon.price || 0),
      0
    );

  // =========================
  // TAX
  // =========================

  const taxPercentage =
    product?.isTaxApplicable
      ? Number(
        product?.taxId?.taxPercentage || 0
      )
      : 0;

  const taxAmount =
    (
      (
        discountedPrice +
        addonTotal
      ) *
      taxPercentage
    ) / 100;

  // =========================
  // FINAL
  // =========================

  const singleItemPrice = discountedPrice + addonTotal + taxAmount;

  const savedAmount = basePrice - discountedPrice;

  const totalPrice = singleItemPrice * qty;

  // =========================
  // ADDON TOGGLE
  // =========================

  const toggleAddon = (addon) => {

    const exists =
      selectedAddons.find(
        (a) =>
          a.addonName ===
          addon.addonName
      );

    if (exists) {

      setSelectedAddons((prev) =>
        prev.filter(
          (a) =>
            a.addonName !==
            addon.addonName
        )
      );

    } else {

      setSelectedAddons((prev) => [
        ...prev,
        addon
      ]);
    }
  };

  // =========================
  // CUSTOMIZATION TOGGLE
  // =========================

  const toggleCustomization = (
    label
  ) => {

    const exists =
      selectedCustomizations.includes(
        label
      );

    if (exists) {

      setSelectedCustomizations(
        (prev) =>
          prev.filter(
            (c) => c !== label
          )
      );

    } else {

      setSelectedCustomizations(
        (prev) => [
          ...prev,
          label
        ]
      );
    }
  };

  return (

    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        background:
          "rgba(0,0,0,0.55)",
        backdropFilter:
          "blur(3px)"
      }}
    >

      <div className="modal-dialog modal-dialog-centered modal-lg">

        <div
          className="modal-content border-0"
          style={{
            borderRadius: "24px",
            overflow: "hidden"
          }}
        >

          {/* HEADER */}
          <div className="modal-header border-0 pb-0 px-4 pt-4">

            <button
              type="button"
              className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center ms-auto"
              onClick={onClose}
              style={{
                width: "42px",
                height: "42px",
              }}
            >

              <i className="bx bx-x fs-4"></i>

            </button>

          </div>

          {/* BODY */}
          <div className="modal-body px-4 pb-4 pt-0">

            <div className="row g-4">

              {/* IMAGE */}
              <div className="col-lg-4">

                <img
                  src={
                    product.image ||
                    "https://placehold.co/600x600?text=Menu"
                  }
                  alt={product.menuName}
                  className="img-fluid rounded-4 border w-100"
                  style={{
                    height: "280px",
                    objectFit: "cover"
                  }}
                />

                {/* PRICE SUMMARY */}
                <div className="border rounded-4 p-3 bg-light mt-3">

                  {
                    hasValidOffer && (

                      <div className="text-danger fw-semibold">

                        Save ₹ {savedAmount.toFixed(2)}

                      </div>

                    )
                  }

                  <div className="fs-2 fw-bold">

                    ₹ {singleItemPrice.toFixed(2)}

                  </div>

                  {
                    hasValidOffer && (

                      <div className="small text-success">

                        Original:
                        {" "}
                        ₹ {basePrice.toFixed(2)}

                      </div>

                    )
                  }

                  <div className="small mt-2">

                    {
                      hasValidOffer && (

                        <div className="text-danger">

                          Offer:
                          {" "}
                          -₹ {
                            (
                              basePrice -
                              discountedPrice
                            ).toFixed(2)
                          }

                        </div>

                      )
                    }

                    {
                      selectedAddons.length > 0 && (

                        <div className="text-primary">

                          Addons:
                          {" "}
                          +₹ {addonTotal.toFixed(2)}

                        </div>

                      )
                    }

                    {
                      product.isTaxApplicable && (

                        <div className="text-success">

                          Tax:
                          {" "}
                          +₹ {taxAmount.toFixed(2)}

                        </div>

                      )
                    }

                  </div>

                </div>

              </div>

              {/* DETAILS */}
              <div className="col-lg-8">

                {/* NAME */}
                <div className="mb-3">

                  <h2 className="fw-bold mb-1">
                    {product.menuName}
                  </h2>

                  <div className="text-muted mb-3">
                    #{product.menuCode}
                  </div>

                  <div className="d-flex gap-2 flex-wrap">

                    {
                      product.isCombo && (
                        <span className="badge bg-warning-subtle text-warning">
                          Combo
                        </span>
                      )
                    }

                    {
                      product.hasOffer && (
                        <span className="badge bg-success-subtle text-success">
                          Offer
                        </span>
                      )
                    }

                    {
                      product.foodType && (
                        <span className="badge bg-dark-subtle text-dark">
                          {product.foodType.replace("_", " ")}
                        </span>
                      )
                    }

                    {
                      product.addons?.length > 0 && (

                        <span className="badge bg-primary-subtle text-primary">

                          {product.addons.length}
                          {" "}
                          Addons Available

                        </span>

                      )
                    }

                    {
                      product.customizationOptions?.length > 0 && (

                        <span className="badge bg-info-subtle text-info">

                          Customizable

                        </span>

                      )
                    }

                  </div>

                </div>

                {/* DESCRIPTION */}
                {
                  product.description && (

                    <div className="mb-4">

                      <p className="text-muted mb-0">
                        {product.description}
                      </p>

                    </div>

                  )
                }

                {/* COMBO ITEMS */}
                {
                  product.isCombo &&
                  product.comboItems?.length > 0 && (

                    <div className="mb-4">

                      <h6 className="fw-semibold mb-3">
                        Combo Includes
                      </h6>

                      <div className="d-flex flex-column gap-2">

                        {
                          product.comboItems.map(
                            (item, index) => (

                              <div
                                key={`${item.menuId?._id}-${index}`}
                                className="d-flex justify-content-between border rounded-3 p-2"
                              >

                                <span>
                                  {
                                    item.menuId?.menuName
                                  }
                                </span>

                                <span className="fw-semibold">
                                  x{item.qty}
                                </span>

                              </div>

                            )
                          )
                        }

                      </div>

                    </div>

                  )
                }

                {/* ADDONS */}
                {
                  product.addons?.length > 0 && (

                    <div className="mb-4">

                      <h6 className="fw-semibold mb-3">
                        Addons
                      </h6>

                      <div className="d-flex flex-wrap gap-2">

                        {
                          product.addons.map(
                            (
                              addon,
                              index
                            ) => {

                              const selected =
                                selectedAddons.find(
                                  (a) =>
                                    a.addonName ===
                                    addon.addonName
                                );

                              return (

                                <button
                                 key={`${addon.addonName}-${index}`}
                                  type="button"
                                  className={`btn ${selected
                                      ? "btn-primary"
                                      : "btn-outline-secondary"
                                    } rounded-pill`}
                                  onClick={() =>
                                    toggleAddon(addon)
                                  }
                                >

                                  {addon.addonName}

                                  {" "}
                                  (+₹{addon.price})

                                </button>

                              );
                            }
                          )
                        }

                      </div>

                    </div>

                  )
                }

                {/* CUSTOMIZATION */}
                {
                  product.customizationOptions?.length > 0 && (

                    <div className="mb-4">

                      <h6 className="fw-semibold mb-3">
                        Customization
                      </h6>

                      <div className="d-flex flex-wrap gap-2">

                        {
                          product.customizationOptions.map(
                            (
                              item,
                              index
                            ) => {

                              const selected =
                                selectedCustomizations.includes(
                                  item.label
                                );

                              return (

                                <button
                                  key={`${item.label}-${index}`}
                                  type="button"
                                  className={`btn ${selected
                                      ? "btn-primary"
                                      : "btn-outline-secondary"
                                    } rounded-pill`}
                                  onClick={() =>
                                    toggleCustomization(
                                      item.label
                                    )
                                  }
                                >

                                  {item.label}

                                </button>

                              );
                            }
                          )
                        }

                      </div>

                    </div>

                  )
                }

                {/* NOTES */}
                <div className="mb-4">

                  <h6 className="fw-semibold mb-2">
                    Notes
                  </h6>

                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Example: Less spicy..."
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* FOOTER */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 border-top pt-4">

                  {/* QTY */}
                  <div className="d-flex align-items-center gap-2">

                    <button
                      className="btn btn-light border rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      onClick={() =>
                        setQty((prev) =>
                          Math.max(
                            1,
                            prev - 1
                          )
                        )
                      }
                    >

                      -

                    </button>

                    <span className="fs-4 fw-semibold px-2">
                      {qty}
                    </span>

                    <button
                      className="btn btn-light border rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      onClick={() =>
                        setQty((prev) =>
                          prev + 1
                        )
                      }
                    >

                      +

                    </button>

                  </div>

                  {/* TOTAL + BUTTON */}
                  <div className="d-flex align-items-center gap-3">

                    <div className="text-end">

                      <div className="small text-muted">
                        Total
                      </div>

                      <div className="fs-4 fw-bold">
                        ₹ {totalPrice.toFixed(2)}
                      </div>

                    </div>

                    <button
                      className="btn btn-primary px-4 py-2 fw-semibold"
                      onClick={() =>
                        onAddToCart(
                          product,
                          qty,
                          selectedAddons,
                          selectedCustomizations,
                          notes
                        )
                      }
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

      </div>

    </div>
  );
};

export default ProductDetailModal;