import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const allMenuItems = [
    {
        id: 1,
        menuCode: "CKZ001",
        menuName: "Crispy Chicken Burger",
        category: "BURGERS",
        price: 149,
        image: "https://via.placeholder.com/50x50.png?text=B1",
    },
    {
        id: 2,
        menuCode: "CKZ002",
        menuName: "Hot Wings 6pcs",
        category: "WINGS",
        price: 199,
        image: "https://via.placeholder.com/50x50.png?text=W6",
    },
    {
        id: 3,
        menuCode: "CKZ003",
        menuName: "French Fries",
        category: "SIDES",
        price: 99,
        image: "https://via.placeholder.com/50x50.png?text=FR",
    },
    {
        id: 4,
        menuCode: "CKZ004",
        menuName: "Chicken Popcorn",
        category: "SNACKS",
        price: 179,
        image: "https://via.placeholder.com/50x50.png?text=CP",
    },
    {
        id: 5,
        menuCode: "CKZ005",
        menuName: "Pepsi Can",
        category: "BEVERAGES",
        price: 60,
        image: "https://via.placeholder.com/50x50.png?text=P",
    },
];

const formatLabel = (value) => {
    return value
        ?.toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const FranchiseMenuVisibilityForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const rowData = location.state?.rowData || {};
    const franchiseName = rowData?.franchiseName || "Franchise";
    const franchiseCode = rowData?.franchiseCode || `FR${id}`;

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [selectedMenus, setSelectedMenus] = useState([1, 2, 4]); // temporary selected assigned menus
    const [saving, setSaving] = useState(false);

    const filteredMenus = useMemo(() => {
        return allMenuItems.filter((item) => {
            const matchSearch =
                item.menuName.toLowerCase().includes(search.toLowerCase()) ||
                item.menuCode.toLowerCase().includes(search.toLowerCase());

            const matchCategory =
                categoryFilter === "ALL" || item.category === categoryFilter;

            return matchSearch && matchCategory;
        });
    }, [search, categoryFilter]);

    const toggleMenu = (menuId) => {
        setSelectedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId]
        );
    };

    const toggleAll = () => {
        const currentPageIds = filteredMenus.map((item) => item.id);
        const allSelected = currentPageIds.every((id) => selectedMenus.includes(id));

        if (allSelected) {
            setSelectedMenus((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelectedMenus((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSave = () => {
        setSaving(true);

        const payload = {
            franchiseId: id,
            franchiseCode,
            franchiseName,
            assignedMenuIds: selectedMenus,
        };

        console.log("SAVE FRANCHISE MENU VISIBILITY:", payload);

        setTimeout(() => {
            setSaving(false);
            navigate("/master-franchise-menu-visibility");
        }, 1000);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Edit Franchise Menu Visibility</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/master-franchise-menu-visibility">
                                                Franchise Menu Visibility
                                            </Link>
                                        </li>
                                        <li className="breadcrumb-item active">Edit</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Franchise Info Card */}
                    <div className="card mb-3">
                        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <h5 className="mb-1">{franchiseName}</h5>
                                <p className="text-muted mb-0">Franchise Code: {franchiseCode}</p>
                            </div>

                            <div className="text-md-end">
                                <span className="badge bg-primary font-size-13 px-3 py-2">
                                    {selectedMenus.length} Menu Assigned
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                <h4 className="card-title mb-0">Assign Menu Items</h4>

                                {/* <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={toggleAll}
                                    >
                                        <i className="bx bx-check-square me-1"></i>
                                        Select / Unselect All
                                    </button>
                                </div> */}
                            </div>
                        </div>

                        <div className="card-body">

                            {/* Filters */}
                            <div className="row mb-3 g-2">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search menu by code or name..."
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
                                        <option value="BEVERAGES">Beverages</option>
                                    </select>
                                </div>

                                <div className="col-md-3 text-end d-flex align-items-center justify-content-md-end">
                                    <span className="text-muted font-size-13">
                                        {filteredMenus.length} menu item
                                        {filteredMenus.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: "50px" }}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={
                                                            filteredMenus.length > 0 &&
                                                            filteredMenus.every((item) =>
                                                                selectedMenus.includes(item.id)
                                                            )
                                                        }
                                                        onChange={toggleAll}
                                                    />
                                                </div>
                                            </th>
                                            <th>Image</th>
                                            <th>Menu Code</th>
                                            <th>Menu Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredMenus.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    No menu items found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMenus.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={selectedMenus.includes(item.id)}
                                                                onChange={() => toggleMenu(item.id)}
                                                            />
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <img
                                                            src={item.image}
                                                            alt={item.menuName}
                                                            width="45"
                                                            height="45"
                                                            className="rounded"
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                    </td>

                                                    <td>{item.menuCode}</td>
                                                    <td>{item.menuName}</td>
                                                    <td>{formatLabel(item.category)}</td>
                                                    <td>₹ {item.price}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Buttons */}
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Link
                                    to="/master-franchise-menu-visibility"
                                    className="btn btn-outline-secondary"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bx bx-save me-1"></i>
                                            Save Visibility
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
};

export default FranchiseMenuVisibilityForm;