import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPackage } from "../../api/packageApi";
import { useDocuments, useLeadSources, useMasalaItems, useMenuItems, useOrderTypes, usePackageStore, usePaymentModes, useTaxStore } from "../../store/store";
import { toast } from "react-toastify";


const MODULE_CONFIG = {
    franchise: {
        title: "Franchise",
        listPath: "/master-franchise",
        icon: "bx-store",
        imageField: "logo",
        tabs: ["basic", "contact", "settings"],
        fields: {
            basic: [
                { name: "franchiseCode", label: "Franchise Code", type: "text", required: true, placeholder: "Enter franchise code", maxLength: 50 },
                { name: "franchiseName", label: "Franchise Name", type: "text", required: true, placeholder: "Enter franchise name", maxLength: 100 },
                { name: "ownerName", label: "Owner Name", type: "text", required: true, placeholder: "Enter owner name", maxLength: 100 },
                { name: "manager", label: "Manager Name", type: "text", placeholder: "Enter manager name", maxLength: 100 },
                { name: "contact", label: "Contact Number", type: "tel", required: true, placeholder: "Enter contact number", maxLength: 10 },
                { name: "email", label: "Email Address", type: "email", required: true, placeholder: "Enter email address", maxLength: 100 },
                {
                    name: "type",
                    label: "Franchise Type",
                    type: "select",
                    required: true,
                    options: ["HEAD_OFFICE", "FRANCHISE", "OUTLET", "KITCHEN", "WAREHOUSE"],
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE", "UNDER_MAINTENANCE", "CLOSED"],
                },
            ],
            contact: [
                { name: "address", label: "Address", type: "textarea", placeholder: "Enter address", col: 12, maxLength: 500 },
                { name: "location", label: "City / Location", type: "text", required: true, placeholder: "Enter city / location", maxLength: 100 },
                { name: "state", label: "State", type: "text", placeholder: "Enter state", maxLength: 50 },
                { name: "country", label: "Country", type: "text", placeholder: "Enter country", maxLength: 50 },
                { name: "zipCode", label: "ZIP / Postal Code", type: "text", placeholder: "Enter zip code", maxLength: 10 },
                { name: "openingDate", label: "Opening Date", type: "date" },
            ],
            settings: [
                { name: "isActiveForBilling", label: "Enable Billing", type: "switch", desc: "Allow this franchise to access billing/POS" },
                { name: "allowMenuControl", label: "Allow Menu Control", type: "switch", desc: "Allow local menu item availability changes" },
                { name: "allowReports", label: "Allow Reports Access", type: "switch", desc: "Allow branch to view reports" },
            ],
        },
        initialValues: {
            franchiseCode: "",
            franchiseName: "",
            ownerName: "",
            manager: "",
            contact: "",
            email: "",
            type: "",
            status: "ACTIVE",
            address: "",
            location: "",
            state: "",
            country: "India",
            zipCode: "",
            openingDate: "",
            isActiveForBilling: true,
            allowMenuControl: true,
            allowReports: true,
            logo: null,
        },
    },

    menu: {
        title: "Menu Item",
        listPath: "/master-menu-item",
        icon: "bx-food-menu",
        imageField: "image",
        tabs: ["basic", "pricing", "settings", "combo"],

        fields: {

            basic: [
                { name: "menuCode", label: "Menu Code", type: "text", required: true },
                { name: "menuName", label: "Menu Name", type: "text", required: true },
                {
                    name: "category",
                    label: "Category",
                    type: "select",
                    required: true,
                    options: [
                        "FRIED_CHICKEN",
                        "NUGGETS",
                        "FRIES",
                        "SANDWICH",
                        "FRANKIES",
                        "BURGER",
                        "MOMOS",
                        "MOJITO",
                        "BUBBLE_TEA",
                        "DESSERT",
                        "COMBO"
                    ]
                },

                {
                    name: "foodType",
                    label: "Food Type",
                    type: "select",
                    required: true,
                    options: [
                        "VEG",
                        "NON_VEG",
                        "BEVERAGE",
                        "DESSERT"
                    ]
                },

                {
                    name: "portionQty",
                    label: "Portion Qty",
                    type: "number",
                    required: true,
                    placeholder: "Example 3 / 100"
                },

                {
                    name: "portionName",
                    label: "Portion Type",
                    type: "select",
                    required: true,
                    options: [
                        "PCS",
                        "GRAM",
                        "ML",
                        "MINI",
                        "NORMAL",
                        "MEDIUM",
                        "LARGE",
                        "CHEESE"
                    ]
                },

                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    col: 12
                }
            ],

            pricing: [
                {
                    name: "price",
                    label: "Selling Price",
                    type: "number",
                    required: true
                },

                {
                    name: "tax",
                    label: "Tax",
                    type: "select",
                    required: true,
                    options: ["GST_5", "GST_12", "GST_18"]
                }
            ],

            settings: [
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE"]
                },

                {
                    name: "isCombo",
                    label: "Is Combo Item",
                    type: "switch"
                },

                {
                    name: "isAddonAllowed",
                    label: "Addon Allowed",
                    type: "switch"
                },

                {
                    name: "isVisibleInBilling",
                    label: "Visible In Billing",
                    type: "switch"
                }
            ],

            combo: [
                {
                    name: "comboBuilder",
                    label: "Combo Items",
                    type: "combo-builder",
                    col: 12,
                    showIf: (formData) => formData.isCombo === true
                }
            ]
        },

        initialValues: {
            menuCode: "",
            menuName: "",
            category: "",
            foodType: "",
            portionQty: "",
            portionName: "",
            description: "",
            price: "",
            tax: "",
            comboItems: [],
            status: "ACTIVE",
            isCombo: false,
            isAddonAllowed: false,
            isVisibleInBilling: true,
            image: null
        }
    },

    payment_mode: {
        title: "Payment Mode",
        listPath: "/master-payment-mode",
        icon: "bx-credit-card",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                { name: "paymentCode", label: "Payment Code", type: "text", required: true, placeholder: "Enter payment code", maxLength: 50 },
                { name: "paymentName", label: "Payment Name", type: "text", required: true, placeholder: "Enter payment mode name", maxLength: 100 },
                {
                    name: "paymentType",
                    label: "Payment Type",
                    type: "select",
                    required: true,
                    options: ["CASH",
                        "UPI",
                        "CARD",
                        "BANK_TRANSFER",
                        "WALLET",
                        "CREDIT"],
                },
                { name: "description", label: "Description", type: "textarea", placeholder: "Enter description", col: 12, maxLength: 500 },
            ],
            settings: [
                { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] },
                { name: "isDefault", label: "Set as Default", type: "switch", desc: "Use as default payment mode" },
            ],
        },
        initialValues: {
            paymentCode: "",
            paymentName: "",
            paymentType: "",
            description: "",
            status: "ACTIVE",
            isDefault: false,
        },
    },

    order_type: {
        title: "Order Type",
        listPath: "/master-order-type",
        icon: "bx-package",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                {
                    name: "orderTypeCode",
                    label: "Order Type Code",
                    type: "text",
                    required: true,
                    placeholder: "Enter order type code",
                    maxLength: 50,
                },
                {
                    name: "orderTypeName",
                    label: "Order Type Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter order type name",
                    maxLength: 100,
                },
                {
                    name: "shortName",
                    label: "Short Name",
                    type: "text",
                    required: false,
                    placeholder: "Enter short name",
                    maxLength: 50,
                },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Enter description",
                    col: 12,
                    maxLength: 500,
                },
            ],
            settings: [
                {
                    name: "serviceChargeApplicable",
                    label: "Service Charge Applicable",
                    type: "switch",
                    desc: "Apply service charge for this order type",
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE"],
                },
                {
                    name: "isDefault",
                    label: "Set as Default",
                    type: "switch",
                    desc: "Use as default order type",
                },
            ],
        },
        initialValues: {
            orderTypeCode: "",
            orderTypeName: "",
            shortName: "",
            description: "",
            serviceChargeApplicable: false,
            status: "ACTIVE",
            isDefault: false,
        },
    },

    lead_source: {
        title: "Lead Source",
        listPath: "/master-lead-source",
        icon: "bx-share-alt",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                { name: "leadSourceCode", label: "Lead Source Code", type: "text", required: true, placeholder: "Enter lead source code", maxLength: 50 },
                { name: "leadSourceName", label: "Lead Source Name", type: "text", required: true, placeholder: "Enter lead source name", maxLength: 100 },
                {
                    name: "leadSourceType", label: "Lead Source Type", type: "select", required: true, options: ["OFFLINE",
                        "DIGITAL",
                        "SOCIAL_MEDIA",
                        "REFERRAL",
                        "EVENT"]
                },
                { name: "description", label: "Description", type: "textarea", placeholder: "Enter description", col: 12, maxLength: 500 },
            ],
            settings: [
                { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] },
                { name: "isDefault", label: "Set as Default", type: "switch", desc: "Use as default lead source" },
            ],
        },
        initialValues: {
            leadSourceCode: "",
            leadSourceName: "",
            leadSourceType: "",
            description: "",
            status: "ACTIVE",
            isDefault: false,
        },
    },


    document: {
        title: "Document",
        listPath: "/master-document",
        icon: "bx-file",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                { name: "documentCode", label: "Document Code", type: "text", required: true, placeholder: "Enter document code", maxLength: 50 },
                { name: "documentName", label: "Document Name", type: "text", required: true, placeholder: "Enter document name", maxLength: 100 },
                {
                    name: "documentType", label: "Document Type", type: "select", required: true, options: ["LEGAL",
                        "LICENSE",
                        "IDENTITY",
                        "FINANCIAL",
                        "MEDIA",
                        "ADDRESS_PROOF"]
                },
                { name: "description", label: "Description", type: "textarea", placeholder: "Enter description", col: 12, maxLength: 500 },
            ],
            settings: [
                { name: "isMandatory", label: "Mandatory Document", type: "switch", desc: "Mark this document as mandatory" },
                { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] },
            ],
        },
        initialValues: {
            documentCode: "",
            documentName: "",
            documentType: "",
            description: "",
            isMandatory: false,
            status: "ACTIVE",
        },
    },

    tax: {
        title: "Tax",
        listPath: "/master-tax",
        icon: "bx-receipt",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                { name: "taxCode", label: "Tax Code", type: "text", required: true, maxLength: 50 },
                { name: "taxName", label: "Tax Name", type: "text", required: true, maxLength: 100 },
                { name: "taxPercentage", label: "Tax Percentage", type: "number", required: true },
                {
                    name: "taxType",
                    label: "Tax Type",
                    type: "select",
                    required: true,
                    options: ["GST", "VAT", "SERVICE_TAX"],
                },
            ],
            settings: [
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE"],
                },
            ],
        },
        initialValues: {
            taxCode: "",
            taxName: "",
            taxPercentage: "",
            taxType: "",
            status: "ACTIVE",
        },
    },

    package: {
        title: "Package",
        listPath: "/master-package",
        icon: "bx-box",
        tabs: ["basic", "pricing", "settings"],
        fields: {
            basic: [
                {
                    name: "packageCode",
                    label: "Package Code",
                    type: "text",
                    required: true,
                    placeholder: "Enter package code",
                    maxLength: 50,
                },
                {
                    name: "packageName",
                    label: "Package Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter package name",
                    maxLength: 100,
                },
                {
                    name: "features",
                    label: "Features",
                    type: "textarea",
                    placeholder: "Enter package features",
                    col: 12,
                    maxLength: 1000,
                },
                {
                    name: "agreementDuration",
                    label: "Agreement Duration",
                    type: "text",
                    required: true,
                    placeholder: "Enter agreement duration (e.g. 12 Months)",
                    maxLength: 50,
                },
                {
                    name: "cartSize",
                    label: "Cart Size",
                    type: "text",
                    required: true,
                    placeholder: "Example: 4x4 / 6x4"
                },
                {
                    name: "cartAmount",
                    label: "Cart Amount",
                    type: "number",
                    required: true,
                    placeholder: "Enter cart amount"
                },
            ],
            pricing: [
                {
                    name: "price",
                    label: "Price",
                    type: "number",
                    required: true,
                    placeholder: "Enter package price"
                },
                {
                    name: "advanceAmount",
                    label: "Advance Amount",
                    type: "number",
                    required: true,
                    placeholder: "Enter advance amount"
                },
                {
                    name: "royaltyType",
                    label: "Royalty Type",
                    type: "select",
                    required: true,
                    options: ["PERCENTAGE", "FIXED"]
                },
                {
                    name: "royaltyValue",
                    label: "Royalty Value",
                    type: "number",
                    placeholder: "Enter royalty value"
                },

                // ✅ ADD THIS (TAX SECTION)
                {
                    name: "isTaxApplicable",
                    label: "Apply GST",
                    type: "checkbox"
                },
                {
                    name: "taxPercentage",
                    label: "GST %",
                    type: "number",
                    placeholder: "Enter GST %",
                    showIf: (formData) => formData.isTaxApplicable
                },
                {
                    name: "isTaxInclusive",
                    label: "Inclusive of GST",
                    type: "checkbox",
                    showIf: (formData) => formData.isTaxApplicable
                },
                {
                    name: "sacCode",
                    label: "SAC Code",
                    type: "text",
                    placeholder: "e.g. 998314",
                    showIf: (formData) => formData.isTaxApplicable
                },

                // ✅ AUTO FIELDS
                {
                    name: "taxAmount",
                    label: "Tax Amount",
                    type: "number",
                    disabled: true
                },
                {
                    name: "totalAmount",
                    label: "Total Amount",
                    type: "number",
                    disabled: true
                }
            ],
            settings: [
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE"]
                },
            ],
        },
        initialValues: {
            packageCode: "",
            packageName: "",
            features: "",
            agreementDuration: "",
            cartSize: "",
            cartAmount: "",
            price: "",
            advanceAmount: "",
            royaltyType: "",
            royaltyValue: "",
            isTaxApplicable: true,
            taxPercentage: 18,
            isTaxInclusive: false,
            sacCode: "",
            taxAmount: 0,
            totalAmount: 0,
            status: "ACTIVE",
        },
    },
    masala_items: {
        title: "Masala Items",
        listPath: "/master-masala-items",
        icon: "bx-bowl-hot",
        tabs: ["basic", "settings"],

        fields: {
            basic: [
                {
                    name: "itemCode",
                    label: "Item Code",
                    type: "text",
                    required: true,
                    placeholder: "Enter item code",
                    maxLength: 50,
                },
                {
                    name: "itemName",
                    label: "Item Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter item name",
                    maxLength: 100,
                },
                {
                    name: "category",
                    label: "Category",
                    type: "select",
                    required: true,
                    options: [
                        "Masala",
                        "Mix Powder",
                        "Coating",
                        "Seasoning",
                        "Sauce",
                    ],
                },
                {
                    name: "packSize",
                    label: "Pack Size",
                    type: "number",
                    required: true,
                    placeholder: "Enter packet size"
                },
                {
                    name: "unit",
                    label: "Unit",
                    type: "select",
                    required: true,
                    options: [
                        "Kg",
                        "Gram",
                        "Packet",
                        "Bottle",
                        "Box",
                    ],
                },
                {
                    name: "price",
                    label: "Price",
                    type: "number",
                    required: true,
                    placeholder: "Enter price",
                },
                {
                    name: "gst",
                    label: "GST %",
                    type: "number",
                    required: true,
                    placeholder: "Enter GST %",
                },
                {
                    name: "stock",
                    label: "Opening Stock",
                    type: "number",
                    required: true,
                    placeholder: "Enter stock quantity",
                },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Enter description",
                    col: 12,
                    maxLength: 500,
                },
            ],

            settings: [
                {
                    name: "lowStockAlert",
                    label: "Low Stock Alert",
                    type: "switch",
                    desc: "Enable low stock notification",
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE"],
                },
                {
                    name: "isDefault",
                    label: "Set as Default",
                    type: "switch",
                    desc: "Use as default item",
                },
            ],
        },

        initialValues: {
            itemCode: "",
            itemName: "",
            category: "",
            packSize: "",
            unit: "",
            price: "",
            gst: "",
            stock: "",
            description: "",
            lowStockAlert: false,
            status: "ACTIVE",
            isDefault: false,
        },
    },
};

const formatLabel = (value) => {
    return value
        ?.toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const CommonMasterForm = ({
    module = "menu",
    mode = "add",
    initialData = {},
    onSubmitSuccess,
}) => {
    const navigate = useNavigate();
    const config = MODULE_CONFIG[module];
    const comboDropdownRef = useRef(null);

    const [activeTab, setActiveTab] = useState(config.tabs[0]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(initialData?.[config.imageField] || null);

    // Get create / update action from Zustand store
    const { addPackage, updatePackage } = usePackageStore();
    const { addTax, updateTax } = useTaxStore();
    const { addMasalaItem, updateMasalaItem } = useMasalaItems();
    const { addPaymentMode, updatePaymentMode } = usePaymentModes();
    const { addOrderType, updateOrderType } = useOrderTypes();
    const { addLeadSource, updateLeadSource } = useLeadSources();
    const { addDocument, updateDocument } = useDocuments();
    const { addMenuItem, updateMenuItem, nonComboMenuItems, fetchNonComboMenuItems } = useMenuItems();

    // create
    const createApiMap = {
        package: addPackage,
        tax: addTax,
        masala_items: addMasalaItem,
        payment_mode: addPaymentMode,
        order_type: addOrderType,
        lead_source: addLeadSource,
        document: addDocument,
        menu: addMenuItem,
    }
    // update
    const updateApiMap = {
        package: updatePackage,
        tax: updateTax,
        masala_items: updateMasalaItem,
        payment_mode: updatePaymentMode,
        order_type: updateOrderType,
        lead_source: updateLeadSource,
        document: updateDocument,
        menu: updateMenuItem,
    }

    // Calculate the total package value 
    const calculatePackageAmount = (form) => {
        let price = Number(form.price) || 0;
        let cartAmount =
            Number(form.cartAmount) || 0;

        let baseAmount =
            price + cartAmount;
        let gst = Number(form.taxPercentage) || 0;

        if (!form.isTaxApplicable) {
            return {
                taxAmount: 0,
                totalAmount: baseAmount
            };
        }

        let taxAmount = 0;
        let totalAmount = 0;

        if (!form.isTaxInclusive) {
            taxAmount = (baseAmount * gst) / 100;
            totalAmount = baseAmount + taxAmount;
        } else {
            taxAmount = (baseAmount * gst) / (100 + gst);
            totalAmount = baseAmount;
        }

        return {
            taxAmount: Math.round(taxAmount),
            totalAmount: Math.round(totalAmount)
        };
    };


    const mergedInitialValues = useMemo(() => {
        return {
            ...config.initialValues,
            ...initialData,

            comboItems:
                module === "menu" && initialData?.comboItems
                    ? initialData.comboItems.map((item) => ({
                        menuId: item.menuId?._id || item.menuId,
                        itemName: item.menuId?.menuName || item.itemName || "",
                        portionQty: item.menuId?.portionQty || "",
                        portionName: item.menuId?.portionName || "",
                        qty: item.qty || 1
                    }))
                    : initialData.comboItems || []
        };

    }, [config.initialValues, initialData]);


    const [form, setForm] = useState(mergedInitialValues);

    const [comboSearch, setComboSearch] = useState("");
    const [comboDropdownOpen, setComboDropdownOpen] = useState(false);

    // Fetch non combo menus for menu item 
    const menuOptions = nonComboMenuItems;

    useEffect(() => {
        if (module === "menu" && form.isCombo) {
            fetchNonComboMenuItems();
        }
    }, [module, form.isCombo]);

    useEffect(() => {
        setForm(mergedInitialValues);
        setImagePreview(initialData?.[config.imageField] || null);
        setErrors({});
        setSuccess(false);
        setActiveTab(config.tabs[0]);
    }, [mergedInitialValues, initialData, config.imageField, config.tabs]);

    // Outside click close for combo dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboDropdownRef.current && !comboDropdownRef.current.contains(event.target)) {
                setComboDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getVisibleTabs = () => {
        return config.tabs.filter((tab) => {
            const visibleFields = config.fields[tab]?.filter(
                (field) => !field.showIf || field.showIf(form)
            );

            if (tab === "combo" && (!form.isCombo || visibleFields.length === 0)) {
                return false;
            }

            return true;
        });
    };

    const validate = () => {
        const e = {};

        config.tabs.forEach((tab) => {
            config.fields[tab]?.forEach((field) => {
                if (field.showIf && !field.showIf(form)) return;

                if (field.required) {
                    const value = form[field.name];

                    if (!value?.toString().trim()) {
                        e[field.name] = `${field.label} is required`;
                    }
                }
            });
        });

        if (module === "menu" && form.isCombo) {
            if (!form.comboItems || form.comboItems.length === 0) {
                e.comboItems = "At least one combo item is required";
            }
        }

        if (form.email) {
            if (!/\S+@\S+\.\S+/.test(form.email)) {
                e.email = "Enter a valid email address";
            }
        }

        return e;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (module === "package") {
            setForm((prev) => {
                const updated = {
                    ...prev,
                    [name]: type === "checkbox" || type === "switch" ? checked : value
                };

                const { taxAmount, totalAmount } = calculatePackageAmount(updated);

                return {
                    ...updated,
                    taxAmount,
                    totalAmount
                };
            });

            return;
        }

        if (name === "contact" || name === "phone" || type === "tel") {
            const numericValue = value.replace(/\D/g, "");
            setForm((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        }
        else if (type === "checkbox") {
            if (module === "menu" && name === "isCombo") {
                if (checked) {
                    setForm((prev) => ({
                        ...prev,
                        isCombo: true,
                        category: "COMBO",
                    }));
                } else {
                    setForm((prev) => ({
                        ...prev,
                        isCombo: false,
                        category: prev.category === "COMBO" ? "" : prev.category,
                        comboItems: [],
                    }));
                    setComboSearch("");
                    setComboDropdownOpen(false);
                }
            } else {
                setForm((prev) => ({
                    ...prev,
                    [name]: checked,
                }));
            }
        }
        else if (module === "menu" && name === "category") {
            if (value === "COMBO") {
                setForm((prev) => ({
                    ...prev,
                    category: "COMBO",
                    isCombo: true,
                }));
            } else {
                setForm((prev) => ({
                    ...prev,
                    category: value,
                    isCombo: false,
                    comboItems: [],
                }));
                setComboSearch("");
                setComboDropdownOpen(false);
            }
        }
        else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setForm((prev) => ({
                ...prev,
                [config.imageField]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const filteredComboOptions = menuOptions.filter(
        (item) =>
            item.menuName.toLowerCase().includes(comboSearch.toLowerCase()) &&
            !form.comboItems?.some(
                (combo) => combo.menuId === item._id
            )
    );

    const addComboItem = (item) => {
        setForm((prev) => ({
            ...prev,
            comboItems: [...(prev.comboItems || []), { menuId: item._id, itemName: item.menuName, qty: 1 }],
        }));
        setComboSearch("");
        setComboDropdownOpen(false);

        if (errors.comboItems) {
            setErrors((prev) => ({ ...prev, comboItems: "" }));
        }
    };

    const updateComboQty = (index, qty) => {
        const parsedQty = Math.max(1, Number(qty) || 1);

        setForm((prev) => {
            const updated = [...(prev.comboItems || [])];
            updated[index] = { ...updated[index], qty: parsedQty };
            return {
                ...prev,
                comboItems: updated,
            };
        });
    };

    const removeComboItem = (index) => {
        setForm((prev) => ({
            ...prev,
            comboItems: prev.comboItems.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const errs = validate();

        let payload = form

        if (module == "package") {
            payload = {
                ...form,
                price: Number(form.price),
                cartAmount: Number(form.cartAmount),
                advanceAmount: Number(form.advanceAmount),
                royaltyValue: Number(form.royaltyValue),
                taxPercentage: Number(form.taxPercentage),
                taxAmount: Number(form.taxAmount),
                totalAmount: Number(form.totalAmount),
            };
        }

        if (module === "menu") {
            payload = {
                ...form,
                price: Number(form.price),
                portionQty: Number(form.portionQty),
                comboItems: form.comboItems.map(i => ({
                    menuId: i.menuId,
                    qty: Number(i.qty)
                }))
            }
        }

        if (module == "package") {
            payload = {
                ...form,
                price: Number(form.price),
                cartAmount: Number(form.cartAmount),
                advanceAmount: Number(form.advanceAmount),
                royaltyValue: Number(form.royaltyValue),
                taxPercentage: Number(form.taxPercentage),
                taxAmount: Number(form.taxAmount),
                totalAmount: Number(form.totalAmount),
            };
        }



        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            toast.warning("Please fill all required fields correctly");
            const firstTabWithError = config.tabs.find((tab) =>
                config.fields[tab]
                    ?.filter((field) => !field.showIf || field.showIf(form))
                    .some((field) => errs[field.name]) ||
                (tab === "combo" && errs.comboItems)
            );

            if (firstTabWithError) setActiveTab(firstTabWithError);
            return;
        }

        if (
            module === "package" &&
            Number(form.advanceAmount) > Number(form.price)
        ) {
            setErrors((prev) => ({
                ...prev,
                advanceAmount: "Advance Amount cannot be greater than Price"
            }));

            toast.warning("Advance Amount cannot be greater than Price");
            setActiveTab("pricing");
            return;
        }



        let res;
        try {
            setSubmitting(true);
            //--- Dynamically call create / update function based on selected module type ---

            if (mode === "edit") {
                res = await updateApiMap[module](initialData._id, payload);
                toast.success(`${config.title} updated successfully`);
            } else {

                const res = await createApiMap[module](payload);
                toast.success(`${config.title} created successfully`);
            }

            console.log(res)

            setTimeout(() => {
                console.log(`${mode.toUpperCase()} ${config.title}:`, form);
                setSubmitting(false);
                setSuccess(true);

                if (onSubmitSuccess) {
                    onSubmitSuccess(form);
                } else {
                    setTimeout(() => {
                        navigate(config.listPath);
                    }, 1200);
                }
            }, 1000);
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message;

            // duplicate key / unique code error
            if (
                msg.toLowerCase().includes("duplicate") ||
                msg.toLowerCase().includes("already exists") ||
                msg.toLowerCase().includes("e11000")
            ) {
                toast.dismiss();
                toast.error("Code already exists. Please use unique code.");
            } else {
                toast.error(msg || "Something went wrong");
                console.log(msg)
            }
        } finally {
            setSubmitting(false)
        }


    };

    const renderComboBuilder = () => {
        return (
            <div>
                <label className="form-label">
                    Combo Items <span className="text-danger">*</span>
                </label>

                <div className="position-relative mb-3" ref={comboDropdownRef}>
                    <div className="input-group">
                        <span className="input-group-text bg-light">
                            <i className="bx bx-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search and add menu item..."
                            value={comboSearch}
                            onFocus={() => setComboDropdownOpen(true)}
                            onChange={(e) => {
                                setComboSearch(e.target.value);
                                setComboDropdownOpen(true);
                            }}
                        />
                    </div>

                    {comboDropdownOpen && (
                        <div
                            className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
                            style={{ maxHeight: "220px", overflowY: "auto", zIndex: 999 }}
                        >
                            {filteredComboOptions.length > 0 ? (
                                filteredComboOptions.map((item, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between"
                                        style={{ cursor: "pointer" }}
                                        onMouseDown={() => addComboItem(item)}
                                    >
                                        <span>
                                            {item.menuName}
                                            {item.portionQty && item.portionName
                                                ? ` (${item.portionQty} ${item.portionName})`
                                                : ""}
                                        </span>
                                        <span className="badge bg-light text-dark">
                                            <i className="bx bx-plus"></i>
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-3 text-muted text-center">
                                    No matching items found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border rounded overflow-hidden">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ minWidth: "220px" }}>Selected Item</th>
                                    <th style={{ width: "140px" }}>Quantity</th>
                                    <th style={{ width: "100px" }} className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.comboItems?.length > 0 ? (
                                    form.comboItems.map((comboItem, index) => (
                                        <tr key={`${comboItem.menuId}-${index}`}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-primary-subtle text-primary">
                                                        <i className="bx bx-dish"></i>
                                                    </span>
                                                    <span className="fw-medium">{comboItem.itemName}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light border"
                                                        onClick={() => updateComboQty(index, comboItem.qty - 1)}
                                                    >
                                                        <i className="bx bx-minus"></i>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={comboItem.qty}
                                                        className="form-control text-center"
                                                        style={{ width: "70px" }}
                                                        onChange={(e) => updateComboQty(index, e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light border"
                                                        onClick={() => updateComboQty(index, comboItem.qty + 1)}
                                                    >
                                                        <i className="bx bx-plus"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-soft-danger"
                                                    onClick={() => removeComboItem(index)}
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">
                                            <i className="bx bx-food-menu font-size-24 d-block mb-2"></i>
                                            No combo items added yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {errors.comboItems && (
                    <div className="text-danger mt-2 font-size-13">{errors.comboItems}</div>
                )}

                {form.comboItems?.length > 0 && (
                    <div className="mt-3 d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <span className="text-muted">Total Selected Items</span>
                        <span className="fw-semibold">{form.comboItems.length}</span>
                    </div>
                )}
            </div>
        );
    };

    const renderField = (field) => {
        let dynamicLabel = field.label;
        let dynamicPlaceholder = field.placeholder;

        if (
            module === "package" &&
            field.name === "royaltyValue"
        ) {
            dynamicLabel =
                form.royaltyType === "PERCENTAGE"
                    ? "Royalty %"
                    : "Royalty Amount";

            dynamicPlaceholder =
                form.royaltyType === "PERCENTAGE"
                    ? "Enter royalty percentage"
                    : "Enter royalty amount";
        }

        const commonProps = {
            name: field.name,
            value: form[field.name] ?? "",
            onChange: handleChange,
            className: `form-control ${errors[field.name] ? "is-invalid" : ""}`,
            placeholder: dynamicPlaceholder || `Enter ${dynamicLabel.toLowerCase()}`,
            maxLength: field.maxLength,
        };

        if (field.type === "combo-builder") {
            return renderComboBuilder();
        }

        if (field.type === "textarea") {
            return (
                <>
                    <textarea {...commonProps} rows="3" />
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        if (field.type === "select") {
            return (
                <>
                    <select
                        name={field.name}
                        value={form[field.name] ?? ""}
                        onChange={handleChange}
                        className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {formatLabel(option)}
                            </option>
                        ))}
                    </select>
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        if (field.type === "switch") {
            return (
                <div className={`p-3 rounded border ${form[field.name] ? "border-primary bg-primary-subtle" : ""}`}>
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                            <h6 className="mb-1">{field.label}</h6>
                            {field.desc && <p className="text-muted mb-0 font-size-13">{field.desc}</p>}
                        </div>
                        <div className="form-check form-switch ms-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                name={field.name}
                                checked={!!form[field.name]}
                                onChange={handleChange}
                                id={`switch-${field.name}`}
                                style={{ width: "2.5rem", height: "1.3rem" }}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (field.type === "checkbox") {
            return (
                <div className="form-check mt-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name={field.name}
                        checked={!!form[field.name]}
                        onChange={handleChange}
                        id={`checkbox-${field.name}`}
                    />
                    <label className="form-check-label ms-2">
                        {field.label}
                    </label>
                </div>
            );
        }

        return (
            <>
                <input type={field.type || "text"} {...commonProps} />
                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
            </>
        );
    };

    const visibleTabs = getVisibleTabs();
    const currentTabIndex = visibleTabs.indexOf(activeTab);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">
                                    {mode === "edit" ? `Edit ${config.title}` : `Create ${config.title}`}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to={config.listPath}>{config.title} List</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {mode === "edit" ? "Edit" : "Create"}
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {success && (
                        <div className="alert alert-success d-flex align-items-center gap-2">
                            <i className="bx bx-check-circle font-size-18"></i>
                            <div>
                                <strong>Success!</strong>{" "}
                                {config.title} {mode === "edit" ? "updated" : "created"} successfully.
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-xl-3">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="mb-3">
                                            <div className="position-relative d-inline-block">
                                                {config.imageField ? (
                                                    imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="preview"
                                                            className="rounded-circle"
                                                            style={{
                                                                width: "100px",
                                                                height: "100px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="avatar-title rounded-circle bg-primary-subtle text-primary"
                                                            style={{
                                                                width: "100px",
                                                                height: "100px",
                                                                fontSize: "2.5rem",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <i className={`bx ${config.icon}`}></i>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div
                                                        className="avatar-title rounded-circle bg-primary-subtle text-primary"
                                                        style={{
                                                            width: "100px",
                                                            height: "100px",
                                                            fontSize: "2.5rem",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <i className={`bx ${config.icon}`}></i>
                                                    </div>
                                                )}

                                                {config.imageField && (
                                                    <label
                                                        className="position-absolute bottom-0 end-0 avatar-xs"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <span className="avatar-title rounded-circle bg-light border">
                                                            <i className="bx bxs-camera text-muted font-size-14"></i>
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="d-none"
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                )}
                                            </div>

                                            <h5 className="mt-3 mb-1 font-size-16">
                                                {form.menuName ||
                                                    form.franchiseName ||
                                                    form.paymentName ||
                                                    form.orderTypeName ||
                                                    form.taxName ||
                                                    form.leadSourceName ||
                                                    form.documentName ||
                                                    form.packageName ||
                                                    form.name ||
                                                    `New ${config.title}`}
                                            </h5>

                                            <span className="badge bg-primary">
                                                {config.title}
                                            </span>
                                        </div>

                                        <hr />

                                        <div className="text-start">
                                            {(module === "menu"
                                                ? [
                                                    { icon: "bx-barcode", val: form.menuCode || "No code yet" },
                                                    { icon: "bx-category", val: formatLabel(form.category) || "No category yet" },
                                                    { icon: "bx-rupee", val: form.price ? `₹ ${form.price}` : "No price yet" },
                                                    { icon: "bx-layer", val: form.isCombo ? "Combo Item" : "Single Item" },
                                                    { icon: "bx-package", val: form.portionQty && form.portionName ? `${form.portionQty} ${form.portionName}` : "No portion yet" },
                                                    { icon: "bx-list-ul", val: form.isCombo && form.comboItems?.length ? `${form.comboItems.length} combo items selected` : "No combo items" },
                                                    { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                ]
                                                : module === "franchise"
                                                    ? [
                                                        { icon: "bx-barcode", val: form.franchiseCode || "No code yet" },
                                                        { icon: "bx-user", val: form.ownerName || "No owner yet" },
                                                        { icon: "bx-phone", val: form.contact || "No contact yet" },
                                                        { icon: "bx-map", val: form.location || "No location yet" },
                                                    ]
                                                    : module === "payment_mode"
                                                        ? [
                                                            { icon: "bx-barcode", val: form.paymentCode || "No code yet" },
                                                            { icon: "bx-tag", val: form.paymentName || "No name yet" },
                                                            { icon: "bx-credit-card", val: formatLabel(form.paymentType) || "No type yet" },
                                                            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                        ]
                                                        : module === "order_type"
                                                            ? [
                                                                { icon: "bx-barcode", val: form.orderTypeCode || "No code yet" },
                                                                { icon: "bx-package", val: form.orderTypeName || "No name yet" },
                                                                { icon: "bx-check-circle", val: form.serviceChargeApplicable ? "Service Charge Enabled" : "No Service Charge" },
                                                                { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                            ]
                                                            : module === "tax"
                                                                ? [
                                                                    { icon: "bx-barcode", val: form.taxCode || "No code yet" },
                                                                    { icon: "bx-receipt", val: form.taxName || "No name yet" },
                                                                    { icon: "bx-percent", val: form.taxPercentage ? `${form.taxPercentage}%` : "No % yet" },
                                                                    { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                                ] : module === "lead_source"
                                                                    ? [
                                                                        { icon: "bx-barcode", val: form.leadSourceCode || "No code yet" },
                                                                        { icon: "bx-share-alt", val: form.leadSourceName || "No lead source yet" },
                                                                        { icon: "bx-category", val: formatLabel(form.leadSourceType) || "No type yet" },
                                                                        { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                                    ] : module === "document"
                                                                        ? [
                                                                            { icon: "bx-barcode", val: form.documentCode || "No code yet" },
                                                                            { icon: "bx-file", val: form.documentName || "No document yet" },
                                                                            { icon: "bx-category", val: formatLabel(form.documentType) || "No type yet" },
                                                                            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                                        ] : module === "package"
                                                                            ? [
                                                                                { icon: "bx-box", val: form.packageCode || "No code yet" },
                                                                                { icon: "bx-package", val: form.packageName || "No package yet" },
                                                                                { icon: "bx-wallet", val: form.price ? `₹ ${form.price}` : "No price yet" },
                                                                                { icon: "bx-pie-chart-alt-2", val: formatLabel(form.royaltyType) || "No royalty type yet" },
                                                                                { icon: "bx-receipt", val: form.taxAmount ? `GST: ₹ ${form.taxAmount}` : "No tax" },
                                                                                { icon: "bx-wallet", val: form.totalAmount ? `Total: ₹ ${form.totalAmount}` : "No total" },
                                                                                { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                                            ]
                                                                            : module === "masala_items"
                                                                                ? [
                                                                                    { icon: "bx-barcode", val: form.itemCode || "No code yet" },
                                                                                    { icon: "bx-bowl-hot", val: form.itemName || "No item yet" },
                                                                                    { icon: "bx-category", val: formatLabel(form.category) || "No category yet" },
                                                                                    {
                                                                                        icon: "bx-package",
                                                                                        val: form.packSize && form.unit
                                                                                            ? `${form.packSize} ${form.unit}`
                                                                                            : "No pack size yet"
                                                                                    },
                                                                                    { icon: "bx-rupee", val: form.price ? `₹ ${form.price}` : "No price yet" },
                                                                                    { icon: "bx-receipt", val: form.gst ? `${form.gst}% GST` : "No GST yet" },
                                                                                    { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                                                ] : [
                                                                                    { icon: "bx-barcode", val: form.code || "No code yet" },
                                                                                    { icon: "bx-tag", val: form.name || "No name yet" },
                                                                                    { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
                                                                                ]
                                            ).map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="d-flex align-items-center gap-2 mb-2 text-muted font-size-13"
                                                >
                                                    <i className={`bx ${item.icon} font-size-16 text-primary`}></i>
                                                    <span className="text-truncate">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <hr />

                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                                {submitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        {mode === "edit" ? "Updating..." : "Saving..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bx bx-save me-1"></i>
                                                        {mode === "edit" ? "Update Record" : "Save Record"}
                                                    </>
                                                )}
                                            </button>

                                            <Link to={config.listPath} className="btn btn-outline-secondary">
                                                <i className="bx bx-arrow-back me-1"></i> Cancel
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-9">
                                <div className="card">
                                    <div className="card-header p-0 border-bottom-0">
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            {visibleTabs.map((tab) => (
                                                <li key={tab} className="nav-item">
                                                    <button
                                                        className={`nav-link py-3 ${activeTab === tab ? "active" : ""}`}
                                                        type="button"
                                                        onClick={() => setActiveTab(tab)}
                                                    >
                                                        <span>{formatLabel(tab)}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="card-body">
                                        <div className="row g-3">
                                            {config.fields[activeTab]
                                                ?.filter((field) => !field.showIf || field.showIf(form))
                                                .map((field) => (
                                                    <div key={field.name} className={`col-md-${field.col || (field.type === "switch" ? 12 : 6)}`}>
                                                        {field.type !== "switch" && field.type !== "combo-builder" && (
                                                            <label className="form-label">{
                                                                module === "package" &&
                                                                    field.name === "royaltyValue"
                                                                    ? (
                                                                        form.royaltyType === "PERCENTAGE"
                                                                            ? "Royalty %"
                                                                            : "Royalty Amount"
                                                                    )
                                                                    : field.label
                                                            }
                                                                {field.required && (
                                                                    <span className="text-danger">*</span>
                                                                )}
                                                            </label>
                                                        )}
                                                        {renderField(field)}
                                                    </div>
                                                ))}
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    if (currentTabIndex > 0) {
                                                        setActiveTab(visibleTabs[currentTabIndex - 1]);
                                                    }
                                                }}
                                                disabled={currentTabIndex === 0}
                                            >
                                                <i className="bx bx-chevron-left me-1"></i> Previous
                                            </button>

                                            {currentTabIndex < visibleTabs.length - 1 ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        setActiveTab(visibleTabs[currentTabIndex + 1]);
                                                    }}
                                                >
                                                    Next <i className="bx bx-chevron-right ms-1"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    disabled={submitting}
                                                    onClick={handleSubmit}
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            {mode === "edit" ? "Updating..." : "Saving..."}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bx bx-save me-1"></i>
                                                            {mode === "edit" ? "Update Record" : "Save Record"}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </React.Fragment>


    );
};

export default CommonMasterForm;