import React, { useMemo, useState } from "react";
import ProductDetailModal from './ProductDetailModal'
import NewCustomerModal from './NewCustomerModal'

const categories = ["All", "Burger", "Drinks", "Dessert", "Rice Bowl"];

const productsData = [
    {
        id: 1,
        name: "Ice Cream",
        category: "Dessert",
        price: 270,
        oldPrice: 300,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
        description: "Cup ice cream for all.",
        stock: "Unlimited",
        tags: ["Veg", "Halal"]
    },
    {
        id: 2,
        name: "Cold Coffee",
        category: "Drinks",
        price: 171,
        oldPrice: 200,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
        description: "Refreshing cold coffee.",
        stock: "Available",
        tags: ["Cold"]
    },
    {
        id: 3,
        name: "Buddy Zinger Combo",
        category: "Burger",
        price: 180,
        oldPrice: 220,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
        description: "Crispy chicken burger combo.",
        stock: "Available",
        tags: ["Hot", "Popular"]
    },
    {
        id: 4,
        name: "Chizza Meal",
        category: "Burger",
        price: 258,
        oldPrice: 290,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
        description: "Cheesy meal combo.",
        stock: "Available",
        tags: ["New"]
    },
    {
        id: 5,
        name: "Popcorn Rice Bowl",
        category: "Rice Bowl",
        price: 130,
        oldPrice: 150,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        description: "Crunchy popcorn chicken rice bowl.",
        stock: "Available",
        tags: ["Spicy"]
    },
    {
        id: 6,
        name: "Fresh Lime",
        category: "Drinks",
        price: 20,
        oldPrice: 30,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
        description: "Fresh lime cooler.",
        stock: "Available",
        tags: ["Cold"]
    },
];

const customers = [
    { id: 1, name: "Walk In Customer", phone: "" },
    { id: 2, name: "Arun Kumar", phone: "9876543210" },
    { id: 3, name: "Suresh", phone: "9123456780" },
];

const Billing = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("Walk In Customer");
    const [orderType, setOrderType] = useState("TAKE_AWAY");
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const filteredProducts = useMemo(() => {
        return productsData.filter((product) => {
            const categoryMatch =
                selectedCategory === "All" || product.category === selectedCategory;

            const searchMatch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase());

            return categoryMatch && searchMatch;
        });
    }, [selectedCategory, search]);

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const addToCart = (product, qty = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }

            return [...prev, { ...product, qty }];
        });

        setShowProductModal(false);
    };

    const updateQty = (id, type) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            qty: type === "inc" ? item.qty + 1 : item.qty - 1,
                        }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

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
                        {/* LEFT - PRODUCT SECTION */}
                        <div className="col-xl-8">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Product Section</h4>
                                </div>

                                <div className="card-body">
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-4">
                                            <select
                                                className="form-select"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
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

                                    <div className="row g-3" style={{ maxHeight: "650px", overflowY: "auto" }}>
                                        {filteredProducts.map((product) => (
                                            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
                                                <div
                                                    className="card border shadow-sm h-100 cursor-pointer"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => openProductModal(product)}
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="card-img-top"
                                                        style={{ height: "140px", objectFit: "cover" }}
                                                    />
                                                    <div className="card-body p-3 text-center">
                                                        <h6 className="mb-1 text-truncate">{product.name}</h6>
                                                        <p className="mb-0 fw-semibold text-dark">₹ {product.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {filteredProducts.length === 0 && (
                                            <div className="col-12 text-center text-muted py-5">
                                                No products found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT - BILLING SECTION */}
                        <div className="col-xl-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Billing Section</h4>
                                </div>

                                <div className="card-body d-flex flex-column">
                                    {/* Customer */}
                                    <div className="mb-3">
                                        <label className="form-label">Customer</label>
                                        <div className="d-flex gap-2">
                                            <select
                                                className="form-select"
                                                value={selectedCustomer}
                                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                            >
                                                {customers.map((cust) => (
                                                    <option key={cust.id} value={cust.name}>
                                                        {cust.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => setShowCustomerModal(true)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Franchise */}
                                    <div className="mb-3">
                                        <label className="form-label">Select Franchise</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value="Main Franchise"
                                            readOnly
                                        />
                                    </div>

                                    {/* Order Type */}
                                    <div className="mb-4">
                                        <label className="form-label">Select Order Type</label>
                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                            {[
                                                { label: "Take Away", value: "TAKE_AWAY" },
                                                { label: "Dine-In", value: "DINE_IN" },
                                                { label: "Home Delivery", value: "HOME_DELIVERY" },
                                            ].map((type) => (
                                                <div className="form-check" key={type.value}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="orderType"
                                                        id={type.value}
                                                        checked={orderType === type.value}
                                                        onChange={() => setOrderType(type.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor={type.value}>
                                                        {type.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cart */}
                                    <div className="border rounded p-3 mb-3 flex-grow-1" style={{ minHeight: "250px", maxHeight: "300px", overflowY: "auto" }}>
                                        <div className="d-flex justify-content-between fw-semibold border-bottom pb-2 mb-3">
                                            <span>Item</span>
                                            <span>Qty</span>
                                            <span>Price</span>
                                            <span>Delete</span>
                                        </div>

                                        {cart.length === 0 ? (
                                            <div className="text-center text-muted py-5">
                                                No items added yet.
                                            </div>
                                        ) : (
                                            cart.map((item) => (
                                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                                                    <div className="d-flex align-items-center gap-2" style={{ width: "40%" }}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                objectFit: "cover",
                                                                borderRadius: "8px"
                                                            }}
                                                        />
                                                        <span className="text-truncate">{item.name}</span>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2">
                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            onClick={() => updateQty(item.id, "dec")}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{item.qty}</span>
                                                        <button
                                                            className="btn btn-sm btn-light"
                                                            onClick={() => updateQty(item.id, "inc")}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <span>₹ {item.price * item.qty}</span>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Summary */}
                                    <div className="border-top pt-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Subtotal</span>
                                            <span>₹ {subtotal}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Tax (5%)</span>
                                            <span>₹ {tax}</span>
                                        </div>
                                        <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                                            <span>Total</span>
                                            <span>₹ {total}</span>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button className="btn btn-light w-50" onClick={cancelOrder}>
                                                Cancel Order
                                            </button>
                                            <button className="btn btn-primary w-50">
                                                Place Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product modal */}
                    <ProductDetailModal
                        show={showProductModal}
                        onClose={() => setShowProductModal(false)}
                        product={selectedProduct}
                        onAddToCart={addToCart}
                    />
                    {/* Customer modal */}
                    <NewCustomerModal
                        show={showCustomerModal}
                        onClose={() => setShowCustomerModal(false)}
                    />

                </div>
            </div>
        </React.Fragment>
    );
};

export default Billing;