import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialData = [
    {
        id: 1,
        menuCode: "CKZ001",
        menuName: "Crispy Chicken Burger",
        category: "BURGERS",
        price: 149,
        available: true,
        image: "https://via.placeholder.com/50x50.png?text=B1",
    },
    {
        id: 2,
        menuCode: "CKZ002",
        menuName: "Hot Wings 6pcs",
        category: "WINGS",
        price: 199,
        available: false,
        image: "https://via.placeholder.com/50x50.png?text=W6",
    },
    {
        id: 3,
        menuCode: "CKZ003",
        menuName: "French Fries",
        category: "SIDES",
        price: 99,
        available: true,
        image: "https://via.placeholder.com/50x50.png?text=FR",
    },
    {
        id: 4,
        menuCode: "CKZ004",
        menuName: "Chicken Popcorn",
        category: "SNACKS",
        price: 179,
        available: true,
        image: "https://via.placeholder.com/50x50.png?text=CP",
    },
];

const formatLabel = (value) => {
    return value
        ?.toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const FranchiseMenuAvailability = () => {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [data, setData] = useState(initialData);

    const filtered = data.filter((item) => {
        const matchSearch =
            item.menuName.toLowerCase().includes(search.toLowerCase()) ||
            item.menuCode.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            categoryFilter === "ALL" || item.category === categoryFilter;

        return matchSearch && matchCategory;
    });

    const toggleAvailability = (id) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, available: !item.available }
                    : item
            )
        );
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">My Menu Availability</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Menu Availability
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title mb-0">Available Menu Items</h4>
                        </div>

                        <div className="card-body">

                            {/* Filters */}
                            <div className="row mb-3 g-2">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search menu..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Categories</option>
                                        <option value="BURGERS">Burgers</option>
                                        <option value="WINGS">Wings</option>
                                        <option value="SIDES">Sides</option>
                                        <option value="SNACKS">Snacks</option>
                                    </select>
                                </div>

                                <div className="col-md-3 text-end">
                                    <span className="text-muted">
                                        {filtered.length} items
                                    </span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Image</th>
                                            <th>Menu Code</th>
                                            <th>Menu Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th className="text-center">Available</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
                                                    No menu found
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <img
                                                            src={item.image}
                                                            alt={item.menuName}
                                                            width="45"
                                                            height="45"
                                                            className="rounded"
                                                        />
                                                    </td>
                                                    <td>{item.menuCode}</td>
                                                    <td>{item.menuName}</td>
                                                    <td>{formatLabel(item.category)}</td>
                                                    <td>₹ {item.price}</td>

                                                    <td className="text-center">
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={item.available}
                                                                onChange={() => toggleAvailability(item.id)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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

export default FranchiseMenuAvailability;