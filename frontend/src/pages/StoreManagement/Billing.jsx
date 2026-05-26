import React, { useEffect, useMemo, useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import NewCustomerModal from "./NewCustomerModal";
import { useAuthStore, useCustomerStore, useFranchiseMenuStore } from "../../store/store";
import Select from "react-select";


const Billing = () => {

    const { franchise, fetchProfile, profile } = useAuthStore();
    const { menus, fetchMyMenus } = useFranchiseMenuStore();
    const { getCustomerByMobile, getFranchiseCustomers } = useCustomerStore();

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [search, setSearch] = useState("");

    useEffect(() => {
        console.log("Franchise : ", franchise);
        console.log("Profile :", profile);
    }, [franchise])

    // const [selectedCustomer, setSelectedCustomer] = useState("Walk In Customer");

    const [orderType, setOrderType] = useState("TAKE_AWAY");

    const [cart, setCart] = useState([]);
    const [mobileNumber, setMobileNumber] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showProductModal, setShowProductModal] = useState(false);

    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const [loadingMenus, setLoadingMenus] = useState(true);
    const [showBillPreview, setShowBillPreview] = useState(false);


    useEffect(() => {
        const loadProfile = async () => {
            await fetchProfile();
        };
        loadProfile();
    }, []);

    useEffect(() => {
        const loadMenus = async () => {
            try {

                setLoadingMenus(true);
                await fetchMyMenus();

            } catch (error) {
                console.log(error);
            } finally {
                setLoadingMenus(false);
            }
        };
        loadMenus();
    }, []);

    useEffect(() => {

    const loadCustomers =
        async () => {

        try {

            const currentFranchiseId =

                franchise?._id ||

                franchise?.franchise?._id;

            if (!currentFranchiseId)
                return;

            const response =
                await getFranchiseCustomers(
                    currentFranchiseId
                );

            setCustomers(response);

        } catch (error) {

            console.log(error);
        }
    };

    loadCustomers();

}, [franchise]);

    const billingMenus = menus.filter(
        (item) =>
            item.isAssigned &&
            item.isVisibleInBilling
    );

    const categories = [
        "All",
        ...new Set(
            billingMenus.map(
                (item) => item.category
            )
        ),
    ];

    const filteredProducts = useMemo(() => {

        return billingMenus.filter((product) => {

            const categoryMatch =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            const searchMatch =
                product.menuName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                product.category
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return (
                categoryMatch &&
                searchMatch
            );

        });

    }, [
        selectedCategory,
        search,
        billingMenus
    ]);

    const calculateMenuPrice = (product) => {

        const basePrice =
            Number(product.price || 0);

        let discountedPrice =
            basePrice;

        if (product.hasOffer) {

            if (
                product.offerType === "PERCENTAGE"
            ) {

                discountedPrice =
                    basePrice -
                    (
                        basePrice *
                        Number(product.offerValue || 0)
                    ) / 100;

            } else {

                discountedPrice =
                    basePrice -
                    Number(product.offerValue || 0);
            }
        }

        discountedPrice =
            Math.max(0, discountedPrice);

        const taxPercentage =
            product.isTaxApplicable
                ? Number(
                    product.taxId?.taxPercentage || 0
                )
                : 0;

        const taxAmount =
            (
                discountedPrice *
                taxPercentage
            ) / 100;

        const finalPrice =
            discountedPrice + taxAmount;

        return {
            basePrice,
            discountedPrice,
            taxAmount,
            finalPrice,
        };
    };

    const openProductModal = (product) => {
        console.log("FULL PRODUCT:", product);
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const searchCustomer = async (mobile) => {
        try {
            if (
                mobile.length !== 10
            ) {
                setSelectedCustomer(null);
                return;
            }

            console.log(
                "SEARCH FRANCHISE ID : ",
                franchise?._id ||
                franchise?.franchise?._id
            );

            const response = await getCustomerByMobile(mobile);

            setSelectedCustomer(response.customer);

        } catch (error) {

            setSelectedCustomer(null);
        }
    };

    const addToCart = (
        product,
        qty = 1,
        selectedAddons = [],
        customizations = [],
        notes = ""
    ) => {

        const basePrice =
            Number(product.price || 0);

        let discountedPrice =
            basePrice;

        const hasValidOffer =
            product?.hasOffer &&
            Number(product?.offerValue || 0) > 0;

        // OFFER
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

        // ADDON TOTAL
        const addonTotal =
            selectedAddons.reduce(
                (sum, addon) =>
                    sum + Number(addon.price || 0),
                0
            );

        // TAX
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

        // FINAL
        const finalPrice =
            discountedPrice +
            addonTotal +
            taxAmount;

        const cartItem = {

            cartId:
                Date.now() +
                Math.random(),

            ...product,

            qty,

            addons:
                selectedAddons,

            customizations,

            notes,

            // PRICE DETAILS
            basePrice,

            discountedPrice,

            addonTotal,

            taxAmount,

            finalPrice,

            // OFFER DETAILS
            offerSaved: hasValidOffer
                ? (
                    basePrice -
                    discountedPrice
                )
                : 0,
        };

        setCart((prev) => [
            ...prev,
            cartItem
        ]);

        setShowProductModal(false);
    };

    const updateQty = (id, type) => {

        setCart((prev) =>

            prev
                .map((item) =>

                    item.cartId === id
                        ? {
                            ...item,
                            qty:
                                type === "inc"
                                    ? item.qty + 1
                                    : item.qty - 1,
                        }
                        : item
                )
                .filter(
                    (item) => item.qty > 0
                )
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) =>
            prev.filter(
                (item) => item.cartId !== id
            )
        );
    };

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            (item.discountedPrice * item.qty),
        0
    );

    const tax = cart.reduce(
        (sum, item) =>
            sum + (item.taxAmount * item.qty),
        0
    );

    const addonTotal = cart.reduce(
        (sum, item) =>
            sum + (item.addonTotal || 0) * item.qty, 0
    );

    const serviceCharge = 0;

    const total = subtotal + addonTotal + tax + serviceCharge;

    const openBillPreview = () => {
        if (cart.length === 0) {
            return;
        }
        setShowBillPreview(true);
    };

    const cancelOrder = () => {
        setCart([]);
        setSelectedCustomer("Walk In Customer");
        setOrderType("TAKE_AWAY");
    };

    return (
        <React.Fragment>

            <div className="page-content">

                <div className="container-fluid">

                    <div className="row">

                        {/* LEFT */}
                        <div className="col-xl-8">

                            <div className="card h-100">

                                <div className="card-header">

                                    <h4 className="card-title mb-0">
                                        Product Section
                                    </h4>

                                </div>

                                <div className="card-body">

                                    {/* FILTERS */}
                                    <div className="row g-3 mb-4">

                                        <div className="col-md-4">

                                            <select
                                                className="form-select"
                                                value={selectedCategory}
                                                onChange={(e) =>
                                                    setSelectedCategory(
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                {
                                                    categories.map((cat) => (

                                                        <option key={cat} value={cat} >
                                                            {cat}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="col-md-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search products..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* PRODUCTS */}
                                    <div
                                        className="row g-3"
                                        style={{
                                            maxHeight: "650px",
                                            overflowY: "auto",
                                        }}
                                    >

                                        {
                                            loadingMenus && (
                                                <div className="col-12 text-center py-5">
                                                    Loading menus...
                                                </div>
                                            )
                                        }

                                        {
                                            filteredProducts.map((product) => {
                                                const pricing = calculateMenuPrice(product);
                                                return (

                                                    <div
                                                        key={product._id}
                                                        className="col-sm-6 col-md-4 col-lg-3"
                                                    >
                                                        <div
                                                            className="card border shadow-sm h-100"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                openProductModal(product)
                                                            }
                                                        >

                                                            <img
                                                                src={
                                                                    product.image ||
                                                                    "https://placehold.co/300x200?text=Menu"
                                                                }
                                                                alt={product.menuName}
                                                                className="card-img-top"
                                                                style={{
                                                                    height: "140px",
                                                                    objectFit: "cover",
                                                                }}
                                                            />

                                                            <div className="card-body p-3 text-center">

                                                                <h6 className="mb-1 text-truncate">
                                                                    {product.menuName}
                                                                </h6>

                                                                <div className="d-flex justify-content-center gap-1 flex-wrap mb-2">

                                                                    {
                                                                        product.isCombo && (
                                                                            <span className="badge bg-warning-subtle text-warning">
                                                                                Combo
                                                                            </span>
                                                                        )
                                                                    }

                                                                    {
                                                                        product.isAddonAllowed && (
                                                                            <span className="badge bg-dark-subtle text-dark">
                                                                                Addons
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

                                                                </div>

                                                                {
                                                                    product.hasOffer ? (

                                                                        <div>

                                                                            <div className="text-muted text-decoration-line-through small">
                                                                                ₹ {pricing.basePrice.toFixed(2)}
                                                                            </div>

                                                                            <div className="fw-bold text-success">
                                                                                ₹ {pricing.finalPrice.toFixed(2)}
                                                                            </div>

                                                                        </div>

                                                                    ) : (

                                                                        <div className="fw-bold text-dark">
                                                                            ₹ {pricing.finalPrice.toFixed(2)}
                                                                        </div>

                                                                    )
                                                                }

                                                            </div>

                                                        </div>

                                                    </div>

                                                );
                                            })
                                        }

                                        {
                                            !loadingMenus &&
                                            filteredProducts.length === 0 && (

                                                <div className="col-12 text-center text-muted py-5">

                                                    No products found.

                                                </div>
                                            )
                                        }

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="col-xl-4">

                            <div className="card h-100">

                                <div className="card-header">

                                    <h4 className="card-title mb-0">
                                        Billing Section
                                    </h4>

                                </div>

                                <div className="card-body d-flex flex-column">

                                    {/* CUSTOMER */}

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Customer
                                        </label>

                                        <div className="d-flex gap-2">

                                            <div className="position-relative w-100">

                                                <Select

                                                    options={customers}

                                                    placeholder="Select Customer"

                                                    value={selectedCustomer}

                                                    getOptionLabel={(c) =>
                                                        `${c.customerName} (${c.mobile})`
                                                    }

                                                    getOptionValue={(c) => c._id}

                                                    onChange={(customer) => {

                                                        setSelectedCustomer(customer);

                                                        setMobileNumber(
                                                            customer.mobile
                                                        )
                                                    }}
                                                />

                                            </div>

                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    setShowCustomerModal(true)
                                                }
                                            >
                                                <i className="bx bx-plus"></i>
                                            </button>

                                        </div>
                                    </div>

                                    {/* FRANCHISE */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Franchise
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            readOnly
                                            value={
                                                `${franchise?.franchise?.franchiseName ||

                                                franchise?.franchiseName ||

                                                "Main Franchise"

                                                } ${franchise?.franchise?.franchiseCode

                                                    ? `(${franchise.franchise.franchiseCode})`

                                                    : franchise?.franchiseCode

                                                        ? `(${franchise.franchiseCode})`

                                                        : ""
                                                }`
                                            }
                                        />

                                    </div>

                                    {/* ORDER TYPE */}
                                    <div className="mb-4">

                                        <label className="form-label">
                                            Select Order Type
                                        </label>

                                        <div className="d-flex flex-wrap gap-3 mt-2">

                                            {
                                                [
                                                    {
                                                        label: "Take Away",
                                                        value: "TAKE_AWAY",
                                                    },
                                                    {
                                                        label: "Dine-In",
                                                        value: "DINE_IN",
                                                    },
                                                    {
                                                        label: "Home Delivery",
                                                        value: "HOME_DELIVERY",
                                                    },
                                                ].map((type) => (

                                                    <div
                                                        className="form-check"
                                                        key={type.value}
                                                    >

                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="orderType"
                                                            id={type.value}
                                                            checked={
                                                                orderType ===
                                                                type.value
                                                            }
                                                            onChange={() =>
                                                                setOrderType(
                                                                    type.value
                                                                )
                                                            }
                                                        />

                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={type.value}
                                                        >
                                                            {type.label}
                                                        </label>

                                                    </div>

                                                ))
                                            }

                                        </div>

                                    </div>
                                    {/* CART */}
                                    <div
                                        className="border rounded p-3 mb-3 flex-grow-1"
                                        style={{
                                            minHeight: "250px",
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                        }}
                                    >

                                        <div className="d-flex justify-content-between fw-semibold border-bottom pb-2 mb-3">

                                            <span>Item</span>

                                            <span>Qty</span>

                                            <span>Price</span>

                                            <span>Delete</span>

                                        </div>

                                        {
                                            cart.length === 0 ? (

                                                <div className="text-center text-muted py-5">

                                                    No items added yet.

                                                </div>

                                            ) : (

                                                cart.map((item, index) => (

                                                    <div
                                                        key={item.cartId}
                                                        className="d-flex justify-content-between align-items-center mb-3"
                                                    >

                                                        <div
                                                            className="d-flex align-items-center gap-2"
                                                            style={{
                                                                width: "40%",
                                                            }}
                                                        >

                                                            <img
                                                                src={
                                                                    item.image ||
                                                                    "https://placehold.co/45x45?text=Menu"
                                                                }
                                                                alt={item.menuName}
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "8px",
                                                                }}
                                                            />

                                                            <div>

                                                                <div className="text-truncate fw-medium">
                                                                    {item.menuName}
                                                                </div>

                                                                {
                                                                    item.customizations?.length > 0 && (

                                                                        <div className="small text-muted">

                                                                            {
                                                                                item.customizations.map(
                                                                                    (c, i) => (
                                                                                        <div key={`${c}-${i}`}>
                                                                                            • {c}
                                                                                        </div>
                                                                                    )
                                                                                )
                                                                            }

                                                                        </div>

                                                                    )
                                                                }

                                                                {
                                                                    item.addons?.length > 0 && (

                                                                        <div className="small text-primary">

                                                                            {
                                                                                item.addons.map(
                                                                                    (a, i) => (
                                                                                        <div key={`${a.addonName}-${i}`}>
                                                                                            + {a.addonName}
                                                                                        </div>
                                                                                    )
                                                                                )
                                                                            }

                                                                        </div>

                                                                    )
                                                                }

                                                            </div>

                                                        </div>

                                                        <div className="d-flex align-items-center gap-2">

                                                            <button
                                                                className="btn btn-sm btn-light"
                                                                onClick={() =>
                                                                    updateQty(
                                                                        item.cartId,
                                                                        "dec"
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </button>

                                                            <span>
                                                                {item.qty}
                                                            </span>

                                                            <button
                                                                className="btn btn-sm btn-light"
                                                                onClick={() =>
                                                                    updateQty(
                                                                        item.cartId,
                                                                        "inc"
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </button>

                                                        </div>

                                                        <span className="fw-semibold">

                                                            ₹ {
                                                                (
                                                                    item.finalPrice *
                                                                    item.qty
                                                                ).toFixed(2)
                                                            }

                                                        </span>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                removeFromCart(item.cartId)}>
                                                            <i className="bx bx-trash"></i>
                                                        </button>

                                                    </div>

                                                ))
                                            )
                                        }

                                    </div>

                                    {/* SUMMARY */}
                                    {/* SUMMARY */}

                                    <div className="border-top pt-3">

                                        {/* SUBTOTAL */}
                                        <div className="d-flex justify-content-between mb-2">

                                            <span>
                                                Subtotal
                                            </span>

                                            <span>
                                                ₹ {subtotal.toFixed(2)}
                                            </span>

                                        </div>

                                        {/* ADDONS */}
                                        <div className="d-flex justify-content-between mb-2">

                                            <span>
                                                Addons
                                            </span>

                                            <span>
                                                ₹ {addonTotal.toFixed(2)}
                                            </span>

                                        </div>

                                        {/* GST */}
                                        <div className="d-flex justify-content-between mb-2">

                                            <span>
                                                GST
                                            </span>

                                            <span>
                                                ₹ {tax.toFixed(2)}
                                            </span>

                                        </div>

                                        {/* SERVICE */}
                                        <div className="d-flex justify-content-between mb-3">

                                            <span>
                                                Service Charge
                                            </span>

                                            <span>
                                                ₹ {serviceCharge.toFixed(2)}
                                            </span>

                                        </div>

                                        <hr />

                                        {/* GRAND TOTAL */}
                                        <div className="d-flex justify-content-between fw-bold fs-3 mb-4">

                                            <span>
                                                Grand Total
                                            </span>

                                            <span className="text-primary">

                                                ₹ {total.toFixed(2)}

                                            </span>

                                        </div>

                                        {/* BUTTONS */}
                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-light w-50"
                                                onClick={cancelOrder}
                                            >
                                                Cancel Order
                                            </button>

                                            <button
                                                className="btn btn-primary w-50"
                                                onClick={openBillPreview}
                                            >
                                                Place Order
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* PRODUCT MODAL */}
                    <ProductDetailModal
                        show={showProductModal}
                        onClose={() =>
                            setShowProductModal(false)
                        }
                        product={selectedProduct}
                        onAddToCart={addToCart}
                    />

                    {
                        showBillPreview && (

                            <div
                                className="modal fade show d-block"
                                style={{
                                    background:
                                        "rgba(0,0,0,0.5)"
                                }}
                            >

                                <div className="modal-dialog modal-dialog-centered">

                                    <div className="modal-content border-0 rounded-4">

                                        {/* HEADER */}
                                        <div className="modal-header">

                                            <div>

                                                <h5 className="fw-bold mb-0">

                                                    {
                                                        franchise?.franchise?.franchiseName ||
                                                        franchise?.franchiseName
                                                    }

                                                </h5>

                                                <div className="small text-muted">

                                                    {
                                                        franchise?.franchise?.franchiseCode ||
                                                        franchise?.franchiseCode
                                                    }

                                                </div>

                                            </div>

                                            <button
                                                className="btn-close"
                                                onClick={() =>
                                                    setShowBillPreview(false)
                                                }
                                            ></button>

                                        </div>

                                        {/* BODY */}
                                        <div className="modal-body">

                                            {
                                                cart.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={item.cartId}
                                                            className="d-flex justify-content-between mb-3"
                                                        >

                                                            <div>

                                                                <div className="fw-semibold">
                                                                    {
                                                                        item.menuName
                                                                    }
                                                                </div>

                                                                <div className="small text-muted">
                                                                    Qty:{" "}{item.qty}
                                                                </div>
                                                            </div>
                                                            <div className="fw-bold">
                                                                ₹ {
                                                                    (
                                                                        item.finalPrice * item.qty
                                                                    ).toFixed(2)
                                                                }
                                                            </div>
                                                        </div>

                                                    )
                                                )
                                            }

                                            <hr />

                                            <div className="d-flex justify-content-between mb-2">
                                                <span>  GST </span>
                                                <span>
                                                    ₹ {tax.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span>
                                                    Service Charge
                                                </span>
                                                <span>
                                                    ₹ {serviceCharge.toFixed(2)}
                                                </span>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between fw-bold fs-4">

                                                <span>Grand Total</span>

                                                <span className="text-primary">
                                                    ₹ {total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-light"
                                                onClick={() =>
                                                    setShowBillPreview(false)
                                                }
                                            >
                                                Close
                                            </button>

                                            <button
                                                className="btn btn-primary"
                                            >
                                                Confirm Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* CUSTOMER MODAL */}
                    <NewCustomerModal

                        show={showCustomerModal}

                        onClose={() =>
                            setShowCustomerModal(false)
                        }

                        franchiseId={
                            franchise?._id || franchise?.franchise?._id
                        }

                        onCustomerCreated={(customer) => {
                            setSelectedCustomer(
                                customer
                            );
                            setMobileNumber(
                                customer.mobile
                            );
                        }}
                    />

                </div>

            </div>

        </React.Fragment>
    );
};

export default Billing;