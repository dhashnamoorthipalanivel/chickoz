import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPackage } from "../../api/packageApi";
import { useDocuments, useFranchiseStore, useLeadSources, useMasalaItems, useMaterials, useMenuItems, useOrderTypes, usePackageStore, usePaymentModes, useTaxStore, useVendorStore } from "../../store/store";
import { toast } from "react-toastify";


const MODULE_CONFIG = {
    franchise: {
        title: "Franchise",
        listPath: "/master-franchise",
        icon: "bx-store",
        imageField: "logo",
        tabs: ["basic", "contact", "settings", "password"],
        fields: {
            basic: [{ name: "referenceId", label: "Reference ID", type: "text", readOnly: true, },
            { name: "franchiseId", label: "Franchise Id", type: "text", readOnly: true, },
            { name: "franchiseName", label: "Franchise Name", type: "text", required: true, },
            { name: "ownerName", label: "Owner Name", type: "text", readOnly: true, },
            { name: "manager", label: "Manager Name", type: "text", placeholder: "Enter manager name", required: true, maxLength: 100, },
            { name: "contact", label: "Contact Number", type: "tel", readOnly: true, },
            { name: "email", label: "Email Address", type: "email", readOnly: true, },
            { name: "packageName", label: "Package Name", type: "text", readOnly: true, },
            { name: "status", label: "Status", type: "select", required: true, options: ["ACTIVE", "UNDER_MAINTENANCE", "INACTIVE", "CLOSED",], },],
            contact: [
                {
                    name: "address",
                    label: "Address",
                    type: "textarea",
                    readOnly: true,
                    col: 12,
                },

                {
                    name: "location",
                    label: "City / Location",
                    type: "text",
                    readOnly: true,
                },

                {
                    name: "state",
                    label: "State",
                    type: "text",
                    readOnly: true,
                },

                {
                    name: "country",
                    label: "Country",
                    type: "text",
                    readOnly: true,
                },

                {
                    name: "postCode",
                    label: "ZIP / Postal Code",
                    type: "text",
                    readOnly: true,
                },

                {
                    name: "openingDate",
                    label: "Opening Date",
                    type: "date",
                    required: true,
                },

            ],
            settings: [
                { name: "isActiveForBilling", label: "Enable Billing", type: "switch", desc: "Allow this franchise to access billing/POS" },
                { name: "allowMenuControl", label: "Allow Menu Control", type: "switch", desc: "Allow local menu item availability changes" },
                { name: "allowReports", label: "Allow Reports Access", type: "switch", desc: "Allow branch to view reports" },
            ],
            password: [
                { name: "username", label: "Username", type: "text", required: true },
                { name: "password", label: "Password", type: "password", required: true, minLength: 8, pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", title: "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)." },
            ],
        },
        initialValues: {
            referenceId: "",
            franchiseCode: "",
            franchiseName: "",
            ownerName: "",
            manager: "",
            contact: "",
            email: "",
            packageName: "",
            type: "",
            status: "ACTIVE",
            address: "",
            location: "",
            state: "",
            country: "India",
            postCode: "",
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
        tabs: ["basic", "pricing", "offers",
            "customization", "settings", "combo"],

        fields: {

            basic: [
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
                    name: "isTaxApplicable",
                    label: "Apply Tax",
                    type: "switch"
                },

                {
                    name: "taxId",
                    label: "Tax",
                    type: "dynamic-select",
                    required: true,
                    optionLabel: "taxName",
                    optionValue: "_id",

                    showIf: (formData) =>
                        formData.isTaxApplicable
                },

                {
                    name: "finalPricePreview",
                    label: "Final Price",
                    type: "menu-price-preview",
                    col: 12
                }
            ],
            offers: [
                {
                    name: "hasOffer",
                    label: "Enable Offer",
                    type: "switch"
                },

                {
                    name: "offerType",
                    label: "Offer Type",
                    type: "select",
                    required: true,
                    options: ["PERCENTAGE", "FLAT"],
                    showIf: (formData) => formData.hasOffer
                },

                {
                    name: "offerValue",
                    label: "Offer Value",
                    type: "number",
                    required: true,
                    showIf: (formData) => formData.hasOffer
                },

                {
                    name: "offerStartDate",
                    label: "Offer Start Date",
                    type: "date",
                    required: true,
                    showIf: (formData) => formData.hasOffer
                },

                {
                    name: "offerEndDate",
                    label: "Offer End Date",
                    type: "date",
                    required: true,
                    showIf: (formData) => formData.hasOffer
                },


            ],
            customization: [

                {
                    name: "isAddonAllowed",
                    label: "Allow Addons",
                    type: "switch"
                },

                {
                    name: "addonBuilder",
                    label: "Addons",
                    type: "addon-builder",
                    col: 12,
                    showIf: (formData) => formData.isAddonAllowed
                },

                {
                    name: "customizationBuilder",
                    label: "Customization Options",
                    type: "customization-builder",
                    col: 12,
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
            menuName: "",
            category: "",
            foodType: "",
            portionQty: "",
            portionName: "",
            description: "",
            price: "",
            hasOffer: false,
            offerType: "",
            offerValue: 0,
            offerStartDate: "",
            offerEndDate: "",
            addons: [],
            customizationOptions: [],
            sortOrder: 0,
            isTaxApplicable: false,
            taxId: "",
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
            leadSourceName: "",
            leadSourceType: "",
            description: "",
            status: "ACTIVE",
            isDefault: false,
        },
    },


    material: {
        title: "Material",
        listPath: "/master-material",
        icon: "bx-box",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                { name: "materialName", label: "Material Name", type: "text", required: true, placeholder: "E.g. Sandwich Toaster", maxLength: 100 },
                {
                    name: "category", label: "Category", type: "select", required: true,
                    options: ["EQUIPMENT", "UTENSIL", "UNIFORM", "ACCESSORY", "STATIONERY", "FURNITURE"],
                },
                {
                    name: "powerType", label: "Power Type", type: "select", required: true,
                    options: ["GAS", "ELECTRIC", "MANUAL", "NOT_APPLICABLE"],
                },
                { name: "quantity", label: "Default Quantity", type: "number", required: true },
                {
                    name: "unit", label: "Unit", type: "select", required: true,
                    options: ["PCS", "SET", "BOX", "PAIR", "KG", "LTR"],
                },
                { name: "description", label: "Description", type: "textarea", placeholder: "Optional notes about this material", col: 12, maxLength: 500 },
            ],
            settings: [
                { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] },
            ],
        },
        initialValues: {
            materialName: "",
            category: "",
            powerType: "NOT_APPLICABLE",
            quantity: 1,
            unit: "PCS",
            description: "",
            status: "ACTIVE",
        },
    },

    document: {
        title: "Document",
        listPath: "/master-document",
        icon: "bx-file",
        tabs: ["basic", "settings"],
        fields: {
            basic: [
                { name: "documentName", label: "Document Name", type: "text", required: true, placeholder: "Enter document name", maxLength: 100 },
                {
                    name: "documentType", label: "Document Type", type: "select", required: true, options: ["LEGAL",
                        "LICENSE",
                        "IDENTITY",
                        "FINANCIAL",
                        "MEDIA",
                        "ADDRESS_PROOF"]
                },
                { name: "validationYear", label: "Validation Year", type: "number", placeholder: "e.g., 1, 2, 5 (Years)" },
                { name: "description", label: "Description", type: "textarea", placeholder: "Enter description", col: 12, maxLength: 500 },
            ],
            settings: [
                { name: "isMandatory", label: "Mandatory Document", type: "switch", desc: "Mark this document as mandatory" },
                { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] },
            ],
        },
        initialValues: {
            documentName: "",
            documentType: "",
            description: "",
            isMandatory: false,
            status: "ACTIVE",
        },
    },
    vendor: {
        title: "Vendor",
        listPath: "/master-vendor",
        icon: "bx-buildings",
        tabs: ["basic", "bank", "settings"],
        fields: {
            basic: [
                { name: "name", label: "Name", type: "text", required: true, maxLength: 100 },
                { name: "phone", label: "Phone", type: "tel", required: true, maxLength: 10, minLength: 10 },
                { name: "email", label: "Email", type: "email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", title: "Enter a valid email address" },
                { name: "companyName", label: "Company Name", type: "text", maxLength: 100 },
                { name: "gstNo", label: "GST No", type: "text", required: true, maxLength: 15, minLength: 15, pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$", title: "Enter a valid 15-character GST number (e.g. 22AAAAA0000A1Z5)" },
                { name: "address", label: "Address", type: "textarea", required: true, col: 12 },
                { name: "city", label: "City", type: "text", required: true, maxLength: 50 },
                { name: "state", label: "State", type: "text", required: true, maxLength: 50 },
            ],
            bank: [
                { name: "bankName", label: "Bank Name", type: "text", required: true, maxLength: 100 },
                { name: "accountNumber", label: "Account Number", type: "text", required: true, minLength: 9, maxLength: 18, pattern: "^[0-9]{9,18}$", title: "Enter a valid account number (9 to 18 digits)" },
                { name: "ifscCode", label: "IFSC Code", type: "text", required: true, maxLength: 11, minLength: 11, pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", title: "Enter a valid 11-character IFSC code (e.g. SBIN0001234)" },
                { name: "accountHolderName", label: "Account Holder Name", type: "text", required: true, maxLength: 100 },
            ],
            settings: [
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["ACTIVE", "INACTIVE"],
                    required: true,
                },
            ],
        },
        initialValues: {
            vendorCode: "",
            name: "",
            companyName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            gstNo: "",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            accountHolderName: "",
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
        tabs: ["basic", "details", "menu_items", "pricing", "settings"],
        fields: {
            basic: [
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
                    label: "Features / Includes",
                    type: "textarea",
                    required: true,
                    placeholder: "List what is included in this package...",
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
            details: [
                {
                    name: "description",
                    label: "Package Description",
                    type: "textarea",
                    required: true,
                    col: 12,
                    placeholder: "Describe the package — what it offers, who it is for...",
                    maxLength: 2000,
                },
                {
                    name: "packageType",
                    label: "Package Type",
                    type: "select",
                    required: true,
                    options: ["GAS", "ELECTRICAL", "BOTH"],
                },
                {
                    name: "photos",
                    label: "Package Photos",
                    type: "multi-photo",
                    required: true,
                    col: 12,
                },
                {
                    name: "kitchenEquipmentIncluded",
                    label: "Kitchen Equipment Included",
                    type: "switch",
                    desc: "Enable to specify which materials / kitchen equipment come with this package",
                },
                {
                    name: "packageMaterials",
                    label: "Kitchen Equipment Checklist",
                    type: "material-checklist",
                    col: 12,
                    showIf: (f) => !!f.kitchenEquipmentIncluded,
                },
            ],
            menu_items: [
                {
                    name: "packageMenuItems",
                    label: "Menu Items",
                    type: "menu-checklist",
                    required: true,
                    col: 12,
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
                    options: ["PERCENTAGE", "FIXED", "NO_ROYALTY"]
                },
                {
                    name: "royaltyValue",
                    label: "Royalty Value",
                    type: "number",
                    placeholder: "Enter royalty value",
                    showIf: (f) => f.royaltyType && f.royaltyType !== "NO_ROYALTY",
                },
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
            packageName: "",
            features: "",
            agreementDuration: "",
            cartSize: "",
            cartAmount: "",
            description: "",
            packageType: "GAS",
            photos: [],
            kitchenEquipmentIncluded: false,
            packageMaterials: [],
            packageMenuItems: [],
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
        tabs: ["basic", "details", "settings"],

        fields: {
            basic: [
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
                    name: "vegType",
                    label: "Veg / Non-Veg",
                    type: "radio",
                    required: true,
                    options: ["VEG", "NON_VEG"],
                },
                {
                    name: "packSize",
                    label: "Net Weight",
                    type: "number",
                    required: true,
                    placeholder: "Enter net weight"
                },
                {
                    name: "unit",
                    label: "Unit",
                    type: "select",
                    required: true,
                    options: [
                        "KG",
                        "GRAM",
                        "PACKET",
                        "BOTTLE",
                        "BOX",
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
                    name: "isTaxApplicable",
                    label: "Apply Tax",
                    type: "switch"
                },
                {
                    name: "taxId",
                    label: "Tax",
                    type: "dynamic-select",
                    required: true,
                    optionLabel: "taxName",
                    optionValue: "_id",

                    showIf: (formData) =>
                        formData.isTaxApplicable
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

            details: [
                {
                    name: "mfd",
                    label: "Manufacturing Date (MFD)",
                    type: "date",
                    required: true,
                },
                {
                    name: "expiryDate",
                    label: "Expiry Date",
                    type: "date",
                    required: true,
                },
                {
                    name: "batchNo",
                    label: "Batch No.",
                    type: "text",
                    required: true,
                    placeholder: "e.g. 79/BZK/25",
                    maxLength: 50,
                },
                {
                    name: "ingredients",
                    label: "Ingredients",
                    type: "textarea",
                    required: true,
                    placeholder: "List all ingredients (e.g. Spices, Salt, Hydrolyzed Vegetable Protein...)",
                    col: 12,
                    maxLength: 2000,
                    rows: 4,
                },
                {
                    name: "allergens",
                    label: "Contains / Allergen Info",
                    type: "textarea",
                    required: true,
                    placeholder: "e.g. Contains: Soy. May contain: Nuts, Celery, Wheat & Milk.",
                    col: 12,
                    maxLength: 500,
                },
                {
                    name: "usageInstructions",
                    label: "Usage Instructions",
                    type: "richtext",
                    required: true,
                    placeholder: "Describe usage instructions, cooking steps, serving suggestions...",
                    col: 12,
                    maxLength: 2000,
                    rows: 5,
                },
                {
                    name: "storageInstructions",
                    label: "Storage Instructions",
                    type: "text",
                    required: true,
                    placeholder: "e.g. Store in an airtight container after opening",
                    col: 12,
                    maxLength: 300,
                },
            ],

            settings: [
                {
                    name: "isHalal",
                    label: "Halal Certified",
                    type: "switch",
                    desc: "This product is Halal certified",
                },
                {
                    name: "isInstitutional",
                    label: "Institutional Pack",
                    type: "switch",
                    desc: "Institutional pack — not for retail sale",
                },
                {
                    name: "fssaiNo",
                    label: "FSSAI License No.",
                    type: "text",
                    required: true,
                    placeholder: "Enter FSSAI license number",
                    maxLength: 50,
                },
                {
                    name: "manufacturer",
                    label: "Manufactured By",
                    type: "text",
                    required: true,
                    placeholder: "Enter manufacturer name and address",
                    col: 12,
                    maxLength: 300,
                },
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
            itemName: "",
            category: "",
            vegType: "VEG",
            packSize: "",
            unit: "",
            price: "",
            isTaxApplicable: true,
            taxId: "",
            stock: "",
            description: "",
            mfd: "",
            expiryDate: "",
            batchNo: "",
            ingredients: "",
            allergens: "",
            usageInstructions: "",
            storageInstructions: "",
            isHalal: false,
            isInstitutional: false,
            fssaiNo: "",
            manufacturer: "",
            lowStockAlert: false,
            status: "ACTIVE",
            isDefault: false,
        },
    },
};

/* ─── Rich Text Editor ───────────────────────────────────────── */
const RichTextEditor = ({ name, value, onChange, placeholder }) => {
    const editorRef = React.useRef(null);
    const wrapRef = React.useRef(null);
    const isFirstRender = React.useRef(true);
    const [wordCount, setWordCount] = React.useState(0);
    const [charCount, setCharCount] = React.useState(0);
    const [activeFormats, setActiveFormats] = React.useState({});
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
        if (isFirstRender.current && editorRef.current) {
            editorRef.current.innerHTML = value || "";
            isFirstRender.current = false;
            updateCounts();
        }
    }, []);

    const updateCounts = () => {
        if (!editorRef.current) return;
        const text = editorRef.current.innerText || "";
        setCharCount(text.length);
        setWordCount(text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    };

    const updateActiveFormats = () => {
        const cmds = ["bold", "italic", "underline", "strikeThrough", "insertOrderedList", "insertUnorderedList", "justifyLeft", "justifyCenter", "justifyRight"];
        const active = {};
        cmds.forEach(cmd => { try { active[cmd] = document.queryCommandState(cmd); } catch (_) { } });
        setActiveFormats(active);
    };

    const exec = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        editorRef.current?.focus();
        sync();
        updateActiveFormats();
    };

    const sync = () => {
        onChange({ target: { name, value: editorRef.current?.innerHTML || "" } });
        updateCounts();
    };

    const GROUPS = [
        {
            tools: [
                { cmd: "bold", label: "B", labelStyle: { fontWeight: 900, fontFamily: "Georgia,serif", fontSize: 14 }, title: "Bold (Ctrl+B)" },
                { cmd: "italic", label: "I", labelStyle: { fontStyle: "italic", fontFamily: "Georgia,serif", fontSize: 14 }, title: "Italic (Ctrl+I)" },
                { cmd: "underline", label: "U", labelStyle: { textDecoration: "underline" }, title: "Underline (Ctrl+U)" },
                { cmd: "strikeThrough", label: "S", labelStyle: { textDecoration: "line-through" }, title: "Strikethrough" },
            ]
        },
        {
            tools: [
                { cmd: "insertOrderedList", icon: "bx-list-ol", title: "Ordered List" },
                { cmd: "insertUnorderedList", icon: "bx-list-ul", title: "Bullet List" },
                { cmd: "indent", icon: "bx-right-indent", title: "Indent" },
                { cmd: "outdent", icon: "bx-left-indent", title: "Outdent" },
            ]
        },
        {
            tools: [
                { cmd: "justifyLeft", icon: "bx-align-left", title: "Align Left" },
                { cmd: "justifyCenter", icon: "bx-align-middle", title: "Align Center" },
                { cmd: "justifyRight", icon: "bx-align-right", title: "Align Right" },
            ]
        },
        {
            tools: [
                { cmd: "removeFormat", icon: "bx-eraser", title: "Clear Formatting", danger: true },
            ]
        },
    ];

    const ToolBtn = ({ tool }) => {
        const isActive = !!activeFormats[tool.cmd];
        return (
            <button
                type="button"
                title={tool.title}
                onMouseDown={e => { e.preventDefault(); exec(tool.cmd); }}
                style={{
                    width: 30, height: 28, borderRadius: 6, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.14s", fontSize: 12,
                    border: isActive ? "1.5px solid rgba(217,30,24,0.4)" : "1px solid transparent",
                    background: isActive ? "rgba(217,30,24,0.08)" : "transparent",
                    color: isActive ? "#D91E18" : tool.danger ? "#ef4444" : "#475569",
                    boxShadow: isActive ? "0 1px 4px rgba(217,30,24,0.14)" : "none",
                }}
                onMouseEnter={e => {
                    if (!isActive) {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
                    }
                }}
                onMouseLeave={e => {
                    if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                    }
                }}
            >
                {tool.icon
                    ? <i className={`bx ${tool.icon}`} style={{ fontSize: 15 }} />
                    : <span style={{ lineHeight: 1, ...tool.labelStyle }}>{tool.label}</span>}
            </button>
        );
    };

    return (
        <div ref={wrapRef} style={{
            border: isFocused ? "1.5px solid #F97316" : "1.5px solid #e9ecef",
            borderRadius: 12,
            background: "#fff",
            transition: "border-color 0.18s, box-shadow 0.18s",
            boxShadow: isFocused ? "0 0 0 3.5px rgba(249,115,22,0.14)" : "none",
            overflow: "hidden",
        }}>
            {/* Toolbar Header */}
            <div style={{
                background: isFocused ? "linear-gradient(135deg,rgba(217,30,24,0.03) 0%,rgba(249,115,22,0.04) 100%)" : "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
                transition: "background 0.18s",
            }}>
                {/* Block format selector */}
                <div style={{ position: "relative", marginRight: 2 }}>
                    <select
                        onChange={e => exec("formatBlock", e.target.value)}
                        defaultValue="p"
                        style={{
                            fontSize: 12, padding: "4px 22px 4px 8px", borderRadius: 7,
                            border: "1px solid #e2e8f0", background: "#fff", color: "#374151",
                            cursor: "pointer", height: 28, appearance: "none", fontWeight: 600,
                            minWidth: 88,
                        }}
                    >
                        <option value="p">Normal</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                    <i className="bx bx-chevron-down" style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94a3b8", pointerEvents: "none" }} />
                </div>

                {/* Tool groups with separators */}
                {GROUPS.map((group, gi) => (
                    <React.Fragment key={gi}>
                        <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 3px", flexShrink: 0 }} />
                        {group.tools.map(tool => <ToolBtn key={tool.cmd} tool={tool} />)}
                    </React.Fragment>
                ))}

                {/* Spacer + label */}
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: "#cbd5e1", letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>Rich Text</span>
            </div>

            {/* Editable area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="ckz-rte-editor"
                data-placeholder={placeholder || "Start writing here..."}
                onInput={sync}
                onKeyUp={updateActiveFormats}
                onMouseUp={updateActiveFormats}
                onFocus={() => { setIsFocused(true); updateActiveFormats(); }}
                onBlur={() => { setIsFocused(false); sync(); }}
                style={{
                    minHeight: 160,
                    padding: "16px 18px",
                    fontSize: 13.5,
                    color: "#1A1A1A",
                    outline: "none",
                    lineHeight: 1.8,
                    background: "#fff",
                    fontFamily: "inherit",
                }}
            />

            {/* Footer — word/char count */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 14px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
            }}>
                <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                        <span style={{ fontWeight: 700, color: "#64748b" }}>{wordCount}</span> words
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                        <span style={{ fontWeight: 700, color: "#64748b" }}>{charCount}</span> characters
                    </span>
                </div>
                {charCount > 0 && (
                    <button
                        type="button"
                        title="Clear all content"
                        onMouseDown={e => {
                            e.preventDefault();
                            if (editorRef.current) { editorRef.current.innerHTML = ""; }
                            sync();
                        }}
                        style={{ fontSize: 11, color: "#cbd5e1", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 5, fontWeight: 600, transition: "color 0.13s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

const formatLabel = (value) => {
    return value
        ?.toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const CMF_CSS = `
  .cmf-input { border:1.5px solid #e9ecef; border-radius:9px; padding:10px 14px; font-size:13.5px; width:100%; outline:none; color:#1A1A1A; background:#fff; transition:border-color 0.18s,box-shadow 0.18s; font-family:inherit; }
  .cmf-input:focus { border-color:#F97316; box-shadow:0 0 0 3.5px rgba(249,115,22,0.14); outline:none; }
  .cmf-input.is-invalid { border-color:#dc3545 !important; }
  .cmf-input:disabled, .cmf-input[readonly] { background:#f8f9fa; color:#9ca3af; cursor:not-allowed; }
  select.cmf-input { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; padding-right:36px; }
  .cmf-label { display:block; font-size:11.5px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.7px; margin-bottom:7px; }
  .cmf-err { color:#dc3545; font-size:11.5px; margin-top:5px; display:flex; align-items:center; gap:4px; }
  .cmf-card { background:#fff; border-radius:14px; border:1px solid #f0f0f0; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
  .cmf-switch { width:44px; height:24px; border-radius:12px; border:none; cursor:pointer; padding:2px; display:inline-flex; align-items:center; transition:background 0.2s; flex-shrink:0; }
  .cmf-thumb { width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
  .cmf-tab-btn { display:flex; align-items:center; gap:7px; padding:9px 16px; border-radius:10px; border:none; font-weight:600; font-size:13px; cursor:pointer; white-space:nowrap; flex-shrink:0; font-family:inherit; transition:all 0.22s; }
  .cmf-tab-btn:hover { opacity:0.85; }
  @keyframes cmfIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
  .cmf-animate { animation:cmfIn 0.22s ease; }
`;

const EMPTY_OBJ = {};

const TAB_ICONS = {
    basic: "bx-info-circle",
    bank: "bx-buildings",
    settings: "bx-cog",
    contact: "bx-user",
    location: "bx-map",
    address: "bx-map",
    franchise: "bx-store",
    pricing: "bx-rupee",
    items: "bx-list-ul",
    documents: "bx-file",
    password: "bx-lock-alt",
};

const CommonMasterForm = ({
    module = "menu",
    mode = "add",
    initialData = EMPTY_OBJ,
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
    const [showPassword, setShowPassword] = useState({});

    // Get create / update action from Zustand store
    const { addPackage, updatePackage } = usePackageStore();
    const { addTax, updateTax, taxes, fetchTaxes } = useTaxStore();
    const { addMasalaItem, updateMasalaItem } = useMasalaItems();
    const { addPaymentMode, updatePaymentMode } = usePaymentModes();
    const { addOrderType, updateOrderType } = useOrderTypes();
    const { addLeadSource, updateLeadSource } = useLeadSources();
    const { addDocument, updateDocument } = useDocuments();
    const { addMaterial, updateMaterial, materials: materialMasterList, fetchMaterials, loading: materialsLoading } = useMaterials();
    const { addMenuItem, updateMenuItem, menuItems, fetchMenuItems, nonComboMenuItems, fetchNonComboMenuItems, loading: menuItemsLoading } = useMenuItems();
    const { saveFranchise } = useFranchiseStore();
    const { createVendor: addVendor, updateVendor: editVendor } = useVendorStore();

    // create
    const createApiMap = {
        package: addPackage,
        tax: addTax,
        masala_items: addMasalaItem,
        payment_mode: addPaymentMode,
        order_type: addOrderType,
        lead_source: addLeadSource,
        document: addDocument,
        material: addMaterial,
        menu: addMenuItem,
        vendor: addVendor,
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
        material: updateMaterial,
        menu: updateMenuItem,
        franchise: saveFranchise,
        vendor: editVendor,
    }

    useEffect(() => {
        if (module === "menu" || module === "masala_items") {
            fetchTaxes();
        }
        if (module === "package") {
            fetchMaterials();
            fetchMenuItems();
        }
    }, [module]);

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

            photos: Array.isArray(initialData?.photos) ? initialData.photos : [],
            packageMaterials: Array.isArray(initialData?.packageMaterials)
                ? initialData.packageMaterials.map(m => (typeof m === "object" && m !== null) ? (m._id || m.toString()) : m)
                : [],
            packageMenuItems: Array.isArray(initialData?.packageMenuItems)
                ? initialData.packageMenuItems.map(m => (typeof m === "object" && m !== null) ? (m._id || m.toString()) : m)
                : [],

            taxId: initialData?.taxId?._id || initialData?.taxId || "",

            openingDate: initialData?.openingDate
                ? new Date(initialData.openingDate)
                    .toISOString()
                    .split("T")[0]
                : "",

            offerStartDate: initialData?.offerStartDate
                ? new Date(initialData.offerStartDate)
                    .toISOString()
                    .split("T")[0]
                : "",

            offerEndDate: initialData?.offerEndDate
                ? new Date(initialData.offerEndDate)
                    .toISOString()
                    .split("T")[0]
                : "",

            comboItems:
                module === "menu" && initialData?.comboItems
                    ? initialData.comboItems.map((item) => ({
                        menuId: item.menuId?._id || item.menuId,
                        itemName: item.menuId?.menuName || item.itemName || "",
                        portionQty: item.menuId?.portionQty || "",
                        portionName: item.menuId?.portionName || "",
                        qty: item.qty || 1
                    }))
                    : initialData.comboItems || [],

            ...(module === "franchise" && mode === "edit" ? { username: initialData?.email || "" } : {})
        };

    }, [config.initialValues, initialData, module, mode]);


    const [form, setForm] = useState(mergedInitialValues);

    const [resendTimer, setResendTimer] = useState(0);

    const isFranchiseCompleted = module === "franchise" &&

        form.franchiseName &&
        form.ownerName &&
        form.manager &&
        form.contact &&
        form.email &&
        form.packageName &&
        form.address &&
        form.location &&
        form.state &&
        form.postCode &&
        form.openingDate &&
        form.status === "ACTIVE";

    const [comboSearch, setComboSearch] = useState("");
    const [comboDropdownOpen, setComboDropdownOpen] = useState(false);
    const [tabVisible, setTabVisible] = useState(true);

    const switchTab = (key) => {
        if (key === activeTab) return;
        setTabVisible(false);
        setTimeout(() => { setActiveTab(key); setTabVisible(true); }, 160);
    };

    const getTabDone = (tab) => {
        const fields = config.fields[tab] || [];
        const req = fields.filter(f => {
            if (mode === "edit" && f.name === "password") return false;
            return f.required && (!f.showIf || f.showIf(form));
        });
        if (req.length === 0) return fields.length > 0;
        return req.every(f => {
            const v = form[f.name];
            return v !== undefined && v !== null && String(v).trim() !== "";
        });
    };

    const getSidebarStats = () => {
        if (module === "menu") return [
            { icon: "bx-category", val: formatLabel(form.category) || "No category yet" },
            { icon: "bx-rupee", val: form.price ? `₹ ${form.price}` : "No price yet" },
            { icon: "bx-layer", val: form.isCombo ? "Combo Item" : "Single Item" },
            { icon: "bx-package", val: form.portionQty && form.portionName ? `${form.portionQty} ${form.portionName}` : "No portion yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "franchise") return [
            { icon: "bx-barcode", val: form.franchiseId || "No code yet" },
            { icon: "bx-user", val: form.ownerName || "No owner yet" },
            { icon: "bx-phone", val: form.contact || "No contact yet" },
            { icon: "bx-map", val: form.location || "No location yet" },
        ];
        if (module === "payment_mode") return [
            { icon: "bx-tag", val: form.paymentName || "No name yet" },
            { icon: "bx-credit-card", val: formatLabel(form.paymentType) || "No type yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "order_type") return [
            { icon: "bx-package", val: form.orderTypeName || "No name yet" },
            { icon: "bx-check-circle", val: form.serviceChargeApplicable ? "Service Charge On" : "No Service Charge" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "tax") return [
            { icon: "bx-receipt", val: form.taxName || "No name yet" },
            { icon: "bx-percent", val: form.taxPercentage ? `${form.taxPercentage}%` : "No % yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "lead_source") return [
            { icon: "bx-share-alt", val: form.leadSourceName || "No lead source yet" },
            { icon: "bx-category", val: formatLabel(form.leadSourceType) || "No type yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "document") return [
            { icon: "bx-file", val: form.documentName || "No document yet" },
            { icon: "bx-category", val: formatLabel(form.documentType) || "No type yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "vendor") return [
            { icon: "bx-user", val: form.name || "No name yet" },
            { icon: "bx-barcode", val: form.vendorCode || "No code yet" },
            { icon: "bx-phone", val: form.phone || "No phone yet" },
            { icon: "bx-map", val: form.city || "No city yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "package") return [
            { icon: "bx-package", val: form.packageName || "No package yet" },
            { icon: "bx-rupee", val: form.price ? `₹ ${form.price}` : "No price yet" },
            { icon: "bx-pie-chart-alt-2", val: formatLabel(form.royaltyType) || "No royalty yet" },
            { icon: "bx-wallet", val: form.totalAmount ? `Total: ₹ ${form.totalAmount}` : "No total" },
            { icon: "bx-food-menu", val: (form.packageMenuItems || []).length > 0 ? `${form.packageMenuItems.length} menu item${form.packageMenuItems.length > 1 ? "s" : ""} selected` : "No menu items" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "masala_items") return [
            { icon: "bx-bowl-hot", val: form.itemName || "No item yet" },
            { icon: "bx-category", val: formatLabel(form.category) || "No category yet" },
            { icon: "bx-package", val: form.packSize && form.unit ? `${form.packSize} ${formatLabel(form.unit)}` : "No pack size yet" },
            { icon: "bx-rupee", val: form.price ? `₹ ${form.price}` : "No price yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        if (module === "material") return [
            { icon: "bx-box", val: form.materialName || "No material yet" },
            { icon: "bx-category", val: formatLabel(form.category) || "No category yet" },
            { icon: "bx-plug", val: formatLabel(form.powerType) || "No power type yet" },
            { icon: "bx-hash", val: form.quantity ? `${form.quantity} ${formatLabel(form.unit) || ""}` : "No qty yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
        return [
            { icon: "bx-barcode", val: form.code || "No code yet" },
            { icon: "bx-tag", val: form.name || "No name yet" },
            { icon: "bx-check-shield", val: formatLabel(form.status) || "No status yet" },
        ];
    };

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
                    if (mode === "edit" && field.name === "password") return;

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

        if (module === "menu" && form.hasOffer) {

            if (!form.offerType) {
                e.offerType = "Offer type required";
            }

            if (!form.offerValue) {
                e.offerValue = "Offer value required";
            }

        }

        if (
            module === "menu" &&
            form.hasOffer
        ) {

            if (
                form.offerStartDate &&
                form.offerEndDate &&
                new Date(form.offerEndDate) <
                new Date(form.offerStartDate)
            ) {

                e.offerEndDate =
                    "End date cannot be before start date";
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

        if (name === "contact" || name === "phone" || type === "tel" || name === "accountNumber") {
            const numericValue = value.replace(/\D/g, "");
            setForm((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        }
        else if (name === "gstNo" || name === "ifscCode") {
            setForm((prev) => ({
                ...prev,
                [name]: value.toUpperCase(),
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

            let updatedValue = value;

            // Allow only numbers
            const numericFields = [
                "price",
                "stock",
                "packSize",
                "portionQty",
                "offerValue",
                "taxPercentage",
                "advanceAmount",
                "cartAmount",
                "royaltyValue"
            ];

            if (numericFields.includes(name)) {

                updatedValue = value.replace(/[^0-9]/g, "");

                // remove leading zeros
                updatedValue = updatedValue === "" ? "" : String(Number(updatedValue));
            }

            setForm((prev) => ({
                ...prev,
                [name]: updatedValue,
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

    const handleMaterialToggle = (materialId) => {
        setForm((prev) => {
            const current = prev.packageMaterials || [];
            const isSelected = current.includes(materialId);
            return {
                ...prev,
                packageMaterials: isSelected
                    ? current.filter((id) => id !== materialId)
                    : [...current, materialId],
            };
        });
    };

    const handlePhotoAdd = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => {
                    if ((prev.photos || []).length >= 6) return prev;
                    return { ...prev, photos: [...(prev.photos || []), reader.result] };
                });
                if (errors.photos) setErrors((prev) => ({ ...prev, photos: "" }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoRemove = (idx) => {
        setForm((prev) => ({
            ...prev,
            photos: (prev.photos || []).filter((_, i) => i !== idx),
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
                royaltyValue: form.royaltyType === "NO_ROYALTY" ? 0 : Number(form.royaltyValue),
                taxPercentage: Number(form.taxPercentage),
                taxAmount: Number(form.taxAmount),
                totalAmount: Number(form.totalAmount),
                photos: form.photos || [],
                packageMaterials: form.packageMaterials || [],
                packageMenuItems: form.packageMenuItems || [],
            };
        }

        if (module === "menu") {
            payload = {
                ...form,
                price: Number(form.price),
                portionQty: Number(form.portionQty),
                offerType: form.hasOffer ? form.offerType : null,
                offerValue: Number(form.offerValue || 0),
                offerStartDate: form.hasOffer ? form.offerStartDate : null,
                offerEndDate: form.hasOffer ? form.offerEndDate : null,
                sortOrder: Number(form.sortOrder || 0),
                taxId: form.isTaxApplicable ? form.taxId : null,
                addons: form.addons || [],
                customizationOptions: form.customizationOptions || [],
                comboItems: form.comboItems.map(i => ({ menuId: i.menuId, qty: Number(i.qty) }))
            }
        }

        if (module === "masala_items") {
            payload = {
                ...form,
                packSize: Number(form.packSize),
                price: Number(form.price),
                stock: Number(form.stock),
                taxId: form.isTaxApplicable ? form.taxId : null,
            };
        }

        // if (module == "package") {
        //     payload = {
        //         ...form,
        //         price: Number(form.price),
        //         cartAmount: Number(form.cartAmount),
        //         advanceAmount: Number(form.advanceAmount),
        //         royaltyValue: Number(form.royaltyValue),
        //         taxPercentage: Number(form.taxPercentage),
        //         taxAmount: Number(form.taxAmount),
        //         totalAmount: Number(form.totalAmount),
        //     };
        // }



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

            toast.error(msg || "Something went wrong");
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

    const renderAddonBuilder = () => {

        const addAddon = () => {
            setForm((prev) => ({
                ...prev,
                addons: [
                    ...(prev.addons || []),
                    {
                        addonName: "",
                        price: "",
                    },
                ],
            }));
        };

        const updateAddon = (index, field, value) => {
            setForm((prev) => {
                const updated = [...prev.addons];

                updated[index] = {
                    ...updated[index],
                    [field]:
                        field === "price"
                            ? Number(value)
                            : value,
                };

                return {
                    ...prev,
                    addons: updated,
                };
            });
        };

        const removeAddon = (index) => {
            setForm((prev) => ({
                ...prev,
                addons: prev.addons.filter((_, i) => i !== index),
            }));
        };

        return (
            <div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        type="button"
                        style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#D91E18,#F97316)", color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                        onClick={addAddon}
                    >
                        <i className="bx bx-plus"></i> Add Addon
                    </button>
                </div>

                <div className="border rounded">

                    {
                        form.addons?.length > 0 ? (
                            form.addons.map((addon, index) => (

                                <div
                                    key={index}
                                    className="d-flex gap-2 p-3 border-bottom"
                                >

                                    <input
                                        type="text"
                                        placeholder="Addon Name"
                                        className="form-control"
                                        value={addon.addonName}
                                        onChange={(e) =>
                                            updateAddon(
                                                index,
                                                "addonName",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        type="number"
                                        placeholder="Price"
                                        className="form-control"
                                        style={{ maxWidth: "140px" }}
                                        value={addon.price}
                                        onChange={(e) =>
                                            updateAddon(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeAddon(index)}
                                    >
                                        <i className="bx bx-trash"></i>
                                    </button>

                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted py-4">
                                No addons added
                            </div>
                        )
                    }

                </div>

            </div>
        );
    };

    const renderCustomizationBuilder = () => {

        const addCustomization = () => {
            setForm((prev) => ({
                ...prev,
                customizationOptions: [
                    ...(prev.customizationOptions || []),
                    {
                        label: "",
                    },
                ],
            }));
        };

        const updateCustomization = (index, value) => {
            setForm((prev) => {

                const updated = [...prev.customizationOptions];

                updated[index] = {
                    label: value,
                };

                return {
                    ...prev,
                    customizationOptions: updated,
                };
            });
        };

        const removeCustomization = (index) => {
            setForm((prev) => ({
                ...prev,
                customizationOptions:
                    prev.customizationOptions.filter((_, i) => i !== index),
            }));
        };

        return (
            <div>

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <button
                        type="button"
                        style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#D91E18,#F97316)", color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                        onClick={addCustomization}
                    >
                        <i className="bx bx-plus"></i> Add Option
                    </button>

                </div>

                <div className="border rounded">

                    {
                        form.customizationOptions?.length > 0 ? (
                            form.customizationOptions.map((item, index) => (

                                <div
                                    key={index}
                                    className="d-flex gap-2 p-3 border-bottom"
                                >

                                    <input
                                        type="text"
                                        placeholder="Example: No Onion"
                                        className="form-control"
                                        value={item.label}
                                        onChange={(e) =>
                                            updateCustomization(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeCustomization(index)}
                                    >
                                        <i className="bx bx-trash"></i>
                                    </button>

                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted py-4">
                                No customization options added
                            </div>
                        )
                    }

                </div>

            </div>
        );
    };

    const renderMultiPhoto = () => {
        const photos = form.photos || [];
        const maxPhotos = 6;
        const slots = Array.from({ length: maxPhotos });

        return (
            <div>
                <div className="row g-3">
                    {slots.map((_, idx) => {
                        const src = photos[idx];
                        return (
                            <div key={idx} className="col-6 col-md-4 col-lg-2">
                                {src ? (
                                    <div style={{ position: "relative", paddingBottom: "100%", borderRadius: 10, overflow: "hidden", border: "1.5px solid #e9ecef" }}>
                                        <img src={src} alt={`pkg-${idx}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                        <button
                                            type="button"
                                            onClick={() => handlePhotoRemove(idx)}
                                            style={{
                                                position: "absolute", top: 5, right: 5,
                                                width: 22, height: 22, borderRadius: "50%",
                                                border: "none", background: "rgba(217,30,24,0.88)",
                                                color: "#fff", display: "flex", alignItems: "center",
                                                justifyContent: "center", cursor: "pointer",
                                                fontSize: 13, padding: 0, lineHeight: 1,
                                                transition: "transform 0.15s",
                                            }}
                                        ><i className="bx bx-x" /></button>
                                    </div>
                                ) : (
                                    <label style={{ display: "block", paddingBottom: "100%", position: "relative", cursor: idx === photos.length ? "pointer" : "default", opacity: idx === photos.length ? 1 : 0.35 }}>
                                        <div style={{
                                            position: "absolute", inset: 0, borderRadius: 10,
                                            border: idx === photos.length ? "2px dashed #D91E18" : "2px dashed #dee2e6",
                                            background: idx === photos.length ? "rgba(217,30,24,0.03)" : "#fafafa",
                                            display: "flex", flexDirection: "column",
                                            alignItems: "center", justifyContent: "center",
                                            color: idx === photos.length ? "#D91E18" : "#adb5bd",
                                            transition: "all 0.18s",
                                        }}>
                                            <i className="bx bx-image-add" style={{ fontSize: 22 }} />
                                            {idx === photos.length && <span style={{ fontSize: 10, marginTop: 4, fontWeight: 500 }}>Add Photo</span>}
                                        </div>
                                        {idx === photos.length && <input type="file" accept="image/*" multiple className="d-none" onChange={handlePhotoAdd} />}
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
                <p className="mt-2 mb-0" style={{ fontSize: 11, color: "#98a2b3" }}>
                    {photos.length} / {maxPhotos} photos added · Recommended 800×600 px or higher
                </p>
                {errors.photos && (
                    <div style={{ color: "#dc3545", fontSize: 12, marginTop: 6, fontWeight: 500 }}>
                        <i className="bx bx-error-circle me-1" />{errors.photos}
                    </div>
                )}
            </div>
        );
    };

    const renderMaterialChecklist = () => {
        if (materialsLoading) {
            return (
                <div className="text-center py-4">
                    <div className="spinner-border" style={{ color: "#D91E18", width: 28, height: 28, borderWidth: 3 }} role="status" />
                    <div style={{ fontSize: 13, color: "#98a2b3", marginTop: 10 }}>Loading materials...</div>
                </div>
            );
        }
        const list = materialMasterList?.filter(m => m.status === "ACTIVE") || [];
        const selectedIds = form.packageMaterials || [];

        if (list.length === 0) {
            return (
                <div className="text-center py-4" style={{ color: "#98a2b3" }}>
                    <i className="bx bx-box" style={{ fontSize: 32, display: "block", marginBottom: 8 }} />
                    No active materials found. Add materials in the Material master first.
                </div>
            );
        }

        const categories = [...new Set(list.map(m => m.category))];
        const totalSelected = selectedIds.length;

        return (
            <div>
                {totalSelected > 0 && (
                    <div className="mb-3 px-3 py-2 rounded-2" style={{ background: "rgba(217,30,24,0.06)", border: "1px solid rgba(217,30,24,0.18)" }}>
                        <span style={{ color: "#D91E18", fontWeight: 600, fontSize: 13 }}>
                            <i className="bx bx-check-circle me-1" />
                            {totalSelected} item{totalSelected > 1 ? "s" : ""} selected for this package
                        </span>
                    </div>
                )}
                {categories.map((cat) => {
                    const catItems = list.filter(m => m.category === cat);
                    const catSelected = catItems.filter(m => selectedIds.includes(m._id)).length;
                    return (
                        <div key={cat} className="mb-4">
                            <div className="d-flex align-items-center justify-content-between mb-2 pb-2" style={{ borderBottom: "2px solid #f1f3f5" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "#6c757d" }}>
                                    {formatLabel(cat)}
                                </span>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                                    background: catSelected > 0 ? "rgba(217,30,24,0.10)" : "#f1f3f5",
                                    color: catSelected > 0 ? "#D91E18" : "#6c757d",
                                }}>
                                    {catSelected}/{catItems.length}
                                </span>
                            </div>
                            <div className="row g-2">
                                {catItems.map((mat) => {
                                    const checked = selectedIds.includes(mat._id);
                                    return (
                                        <div key={mat._id} className="col-md-6 col-lg-4">
                                            <div
                                                onClick={() => handleMaterialToggle(mat._id)}
                                                style={{
                                                    padding: "10px 13px", borderRadius: 8, cursor: "pointer",
                                                    border: checked ? "1.5px solid #D91E18" : "1.5px solid #e9ecef",
                                                    background: checked ? "rgba(217,30,24,0.04)" : "#fff",
                                                    display: "flex", alignItems: "flex-start", gap: 10,
                                                    transition: "all 0.16s ease",
                                                    userSelect: "none",
                                                }}
                                            >
                                                <div style={{
                                                    width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 2,
                                                    border: checked ? "2px solid #D91E18" : "2px solid #ced4da",
                                                    background: checked ? "#D91E18" : "#fff",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    transition: "all 0.14s",
                                                }}>
                                                    {checked && <i className="bx bx-check" style={{ color: "#fff", fontSize: 11 }} />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 500, fontSize: 13, color: checked ? "#D91E18" : "#344054", lineHeight: 1.3 }}>
                                                        {mat.materialName}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: "#98a2b3", marginTop: 2 }}>
                                                        {mat.quantity} {mat.unit}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const FOOD_TYPE_COLOR = {
        VEG: "#10B981",
        NON_VEG: "#D91E18",
        BEVERAGE: "#3B82F6",
        DESSERT: "#F97316",
    };

    const renderMenuChecklist = () => {
        if (menuItemsLoading) {
            return (
                <div className="text-center py-4">
                    <div className="spinner-border" style={{ color: "#F97316", width: 28, height: 28, borderWidth: 3 }} role="status" />
                    <div style={{ fontSize: 13, color: "#98a2b3", marginTop: 10 }}>Loading menu items...</div>
                </div>
            );
        }
        const allItems = (menuItems || []).filter(m => m.status === "ACTIVE" || !m.status);
        const selectedIds = form.packageMenuItems || [];

        if (allItems.length === 0) {
            return (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                    <i className="bx bx-food-menu" style={{ fontSize: 40, display: "block", marginBottom: 10 }} />
                    No active menu items found. Add menu items in the Menu master first.
                </div>
            );
        }

        const categories = [...new Set(allItems.map(m => m.category).filter(Boolean))];

        const toggleItem = (id) => {
            setForm(prev => {
                const cur = prev.packageMenuItems || [];
                return { ...prev, packageMenuItems: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] };
            });
            if (errors.packageMenuItems) setErrors(prev => ({ ...prev, packageMenuItems: "" }));
        };

        return (
            <div>
                {/* Selected banner */}
                {selectedIds.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderRadius: 9, background: "rgba(217,30,24,0.05)", border: "1px solid rgba(217,30,24,0.14)", marginBottom: 18 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#D91E18" }}>
                            <i className="bx bx-check-circle me-1" />{selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected for this package
                        </span>
                        <button type="button" onClick={() => setForm(p => ({ ...p, packageMenuItems: [] }))}
                            style={{ border: "none", background: "none", color: "#9ca3af", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                            Clear all
                        </button>
                    </div>
                )}

                {/* Legend */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
                    {Object.entries(FOOD_TYPE_COLOR).map(([type, color]) => (
                        <span key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#6b7280" }}>
                            <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
                            {formatLabel(type)}
                        </span>
                    ))}
                </div>

                {/* Cards grouped by category */}
                {categories.map(cat => {
                    const catItems = allItems.filter(m => m.category === cat);
                    const selCount = catItems.filter(m => selectedIds.includes(m._id)).length;
                    return (
                        <div key={cat} style={{ marginBottom: 30 }}>
                            {/* Category header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingBottom: 9, borderBottom: "2px solid #f5f5f5" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "#6b7280" }}>
                                    {formatLabel(cat)}
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: selCount > 0 ? "rgba(217,30,24,0.08)" : "#f5f5f5", color: selCount > 0 ? "#D91E18" : "#9ca3af" }}>
                                    {selCount}/{catItems.length}
                                </span>
                            </div>

                            {/* Item cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 10 }}>
                                {catItems.map(item => {
                                    const checked = selectedIds.includes(item._id);
                                    const dotColor = FOOD_TYPE_COLOR[item.foodType] || "#6b7280";
                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => toggleItem(item._id)}
                                            style={{ borderRadius: 11, border: `1.5px solid ${checked ? "#D91E18" : "#e9ecef"}`, background: checked ? "rgba(217,30,24,0.03)" : "#fff", cursor: "pointer", overflow: "hidden", transition: "all 0.15s", userSelect: "none", position: "relative", boxShadow: checked ? "0 2px 10px rgba(217,30,24,0.12)" : "0 1px 3px rgba(0,0,0,0.04)" }}
                                        >
                                            {/* Image area */}
                                            <div style={{ width: "100%", paddingBottom: "68%", position: "relative", background: "#f8f9fa", overflow: "hidden" }}>
                                                {item.image ? (
                                                    <img src={item.image} alt={item.menuName}
                                                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.2s" }} />
                                                ) : (
                                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f8f9fa 0%,#f0f0f0 100%)" }}>
                                                        <i className="bx bx-dish" style={{ fontSize: 30, color: "#d1d5db" }} />
                                                    </div>
                                                )}
                                                {/* Food type dot — top-left */}
                                                <div style={{ position: "absolute", top: 7, left: 7, width: 10, height: 10, borderRadius: "50%", background: dotColor, border: "2.5px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }} />
                                                {/* Checkbox — top-right */}
                                                <div style={{ position: "absolute", top: 6, right: 6, width: 21, height: 21, borderRadius: 6, border: `2px solid ${checked ? "#D91E18" : "rgba(255,255,255,0.9)"}`, background: checked ? "#D91E18" : "rgba(255,255,255,0.85)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.14s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                                                    {checked && <i className="bx bx-check" style={{ color: "#fff", fontSize: 13 }} />}
                                                </div>
                                                {/* Price badge — bottom */}
                                                {item.price && (
                                                    <div style={{ position: "absolute", bottom: 6, left: 6, padding: "2px 7px", borderRadius: 6, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>
                                                        ₹ {item.price}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info below image */}
                                            <div style={{ padding: "9px 10px 11px" }}>
                                                <div style={{ fontWeight: 700, fontSize: 12.5, color: checked ? "#D91E18" : "#1A1A1A", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>
                                                    {item.menuName}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                                                    {item.portionQty && item.portionName && (
                                                        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>
                                                            {item.portionQty} {item.portionName}
                                                        </span>
                                                    )}
                                                    {item.portionQty && item.portionName && item.foodType && (
                                                        <span style={{ color: "#e5e7eb", fontSize: 9 }}>·</span>
                                                    )}
                                                    {item.foodType && (
                                                        <span style={{ fontSize: 10, fontWeight: 600, color: dotColor }}>
                                                            {formatLabel(item.foodType)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                {errors.packageMenuItems && (
                    <div style={{ color: "#dc3545", fontSize: 12, marginTop: 10, fontWeight: 500 }}>
                        <i className="bx bx-error-circle me-1" />{errors.packageMenuItems}
                    </div>
                )}
            </div>
        );
    };

    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");

        const secs = String(seconds % 60).padStart(2, "0");

        return `${mins}:${secs}`;
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

            className: `form-control${errors[field.name] ? " is-invalid" : ""}`,

            placeholder:
                dynamicPlaceholder ||
                `Enter ${dynamicLabel.toLowerCase()}`,

            maxLength:
                field.maxLength,

            minLength:
                field.minLength,

            pattern:
                field.pattern,

            title:
                field.title,

            readOnly: field.readOnly || (mode === "edit" && field.name === "username") || (module === "franchise" && form.status === "INACTIVE" && field.name !== "status"),

            disabled:
                field.disabled,
        };

        if (field.type === "combo-builder") {
            return renderComboBuilder();
        }

        if (field.type === "addon-builder") {
            return renderAddonBuilder();
        }

        if (field.type === "customization-builder") {
            return renderCustomizationBuilder();
        }

        if (field.type === "multi-photo") {
            return renderMultiPhoto();
        }

        if (field.type === "material-checklist") {
            return renderMaterialChecklist();
        }

        if (field.type === "menu-checklist") {
            return renderMenuChecklist();
        }

        if (field.type === "textarea") {
            return (
                <>
                    <textarea {...commonProps} rows={field.rows || 3} style={{ resize: "vertical" }} />
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        if (field.type === "dynamic-select") {

            let options = [];

            if (field.name === "taxId") {
                options = taxes || [];
            }

            return (
                <>
                    <select
                        name={field.name}
                        value={form[field.name] ?? ""}
                        onChange={handleChange}
                        className={`form-select${errors[field.name] ? " is-invalid" : ""}`}
                    >
                        <option value="">Select {field.label}</option>
                        {options.map((option) => (
                            <option key={option[field.optionValue]} value={option[field.optionValue]}>
                                {option[field.optionLabel]} ({option.taxPercentage}%)
                            </option>
                        ))}
                    </select>
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
                        className={`form-select${errors[field.name] ? " is-invalid" : ""}`}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>{formatLabel(option)}</option>
                        ))}
                    </select>
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        if (field.type === "switch") {
            const isOn = !!form[field.name];
            return (
                <div style={{ padding: "16px 20px", borderRadius: 12, border: `1.5px solid ${isOn ? "rgba(217,30,24,0.25)" : "#e9ecef"}`, background: isOn ? "rgba(217,30,24,0.03)" : "#fafafa", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>{field.label}</div>
                            {field.desc && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{field.desc}</div>}
                        </div>
                        <button type="button" className="cmf-switch"
                            style={{ background: isOn ? "linear-gradient(135deg,#D91E18,#F97316)" : "#e9ecef" }}
                            onClick={() => handleChange({ target: { name: field.name, type: "checkbox", checked: !isOn } })}>
                            <div className="cmf-thumb" style={{ transform: isOn ? "translateX(20px)" : "translateX(0)" }} />
                        </button>
                    </div>
                </div>
            );
        }

        if (field.type === "checkbox") {
            const isChecked = !!form[field.name];
            return (
                <div
                    style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${isChecked ? "rgba(217,30,24,0.3)" : "#e9ecef"}`, background: isChecked ? "rgba(217,30,24,0.04)" : "#fff", transition: "all 0.15s", userSelect: "none" }}
                    onClick={() => handleChange({ target: { name: field.name, type: "checkbox", checked: !isChecked } })}
                >
                    <div style={{ width: 17, height: 17, borderRadius: 4, border: `2px solid ${isChecked ? "#D91E18" : "#ced4da"}`, background: isChecked ? "#D91E18" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.14s" }}>
                        {isChecked && <i className="bx bx-check" style={{ color: "#fff", fontSize: 11 }} />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isChecked ? "#D91E18" : "#374151" }}>{field.label}</span>
                </div>
            );
        }

        if (field.type === "radio") {
            const val = form[field.name] || "";
            const RADIO_META = {
                VEG: { label: "Veg", color: "#065F46", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.35)", dot: "#10B981", icon: "bx-leaf" },
                NON_VEG: { label: "Non-Veg", color: "#991B1B", bg: "rgba(153,27,27,0.08)", border: "rgba(153,27,27,0.3)", dot: "#D91E18", icon: "bx-bowl-hot" },
            };
            return (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(field.options || []).map((opt) => {
                        const m = RADIO_META[opt] || { label: opt, color: "#374151", bg: "#f3f4f6", border: "#d1d5db", dot: "#6b7280", icon: "bx-circle" };
                        const selected = val === opt;
                        return (
                            <label key={opt} onClick={() => handleChange({ target: { name: field.name, value: opt } })}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px", borderRadius: 10, cursor: "pointer", userSelect: "none", transition: "all 0.18s",
                                    border: selected ? `2px solid ${m.border}` : "2px solid #e9ecef",
                                    background: selected ? m.bg : "#fafafa",
                                    boxShadow: selected ? `0 2px 8px ${m.dot}28` : "none",
                                }}>
                                <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected ? m.dot : "#ced4da"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                                    {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot }} />}
                                </div>
                                <i className={`bx ${m.icon}`} style={{ fontSize: 14, color: selected ? m.color : "#9ca3af" }} />
                                <span style={{ fontWeight: 700, fontSize: 13.5, color: selected ? m.color : "#6b7280" }}>{m.label}</span>
                            </label>
                        );
                    })}
                </div>
            );
        }

        if (field.type === "richtext") {
            return (
                <RichTextEditor
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder || `Enter ${field.label}...`}
                />
            );
        }

        if (field.type === "menu-price-preview") {

            if (!form.price) {
                return null;
            }

            const basePrice =
                Number(form.price || 0);

            let discountedPrice =
                basePrice;

            let discountAmount = 0;

            if (form.hasOffer) {

                if (form.offerType === "PERCENTAGE") {

                    discountAmount =
                        (basePrice * Number(form.offerValue || 0)) / 100;

                } else {

                    discountAmount =
                        Number(form.offerValue || 0);
                }

                discountedPrice =
                    basePrice - discountAmount;
            }

            discountedPrice =
                Math.max(0, discountedPrice);

            const selectedTax =
                taxes.find(
                    (tax) => tax._id === form.taxId
                );

            const taxPercentage =
                Number(selectedTax?.taxPercentage || 0);

            const taxAmount =
                (discountedPrice * taxPercentage) / 100;

            const finalPrice =
                discountedPrice +
                (
                    form.isTaxApplicable
                        ? taxAmount
                        : 0
                );

            return (
                <div style={{ borderRadius: 14, background: "linear-gradient(135deg,#1A1A1A 0%,#2D2D2D 100%)", padding: "22px 26px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "rgba(255,255,255,0.38)", marginBottom: 16 }}>Final Price Preview</div>
                    {[
                        { label: "Base Price", val: `₹ ${basePrice.toFixed(2)}`, color: "rgba(255,255,255,0.55)" },
                        { label: "Discount", val: `- ₹ ${discountAmount.toFixed(2)}`, color: "#F97316" },
                        { label: `Tax (${taxPercentage}%)`, val: `+ ₹ ${taxAmount.toFixed(2)}`, color: "rgba(255,255,255,0.55)" },
                    ].map(({ label, val, color }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color }}>
                            <span>{label}</span><span>{val}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Final Selling Price</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: "#F97316", letterSpacing: -0.5 }}>₹ {finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            );
        }

        if (field.type === "password") {
            const pass = form[field.name] || "";
            const isVisible = !!showPassword[field.name];
            let strength = null;
            if (pass) {
                if (pass.length < 6) strength = { label: "Weak", color: "#D91E18", width: "33%" };
                else if (pass.length < 8 || !/(?=.*[A-Z])(?=.*[@$!%*?&])/.test(pass)) strength = { label: "Medium", color: "#d97706", width: "66%" };
                else strength = { label: "Strong", color: "#059669", width: "100%" };
            }

            return (
                <>
                    <div className="position-relative">
                        <input
                            type={isVisible ? "text" : "password"}
                            {...commonProps}
                            style={{ ...commonProps.style, paddingRight: "42px" }}
                        />
                        <button
                            type="button"
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none px-3"
                            style={{ border: "none", background: "none", zIndex: 5, cursor: "pointer", boxShadow: "none" }}
                            onClick={() => setShowPassword((prev) => ({ ...prev, [field.name]: !prev[field.name] }))}
                            tabIndex={-1}
                            title={isVisible ? "Hide Password" : "Show Password"}
                        >
                            <i className={`bx ${isVisible ? "bx-hide" : "bx-show"}`} style={{ fontSize: "18px" }} />
                        </button>
                    </div>
                    {strength && (
                        <div style={{ marginTop: 8, padding: "0 2px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                                <span style={{ color: "#6b7280" }}>Password Strength</span>
                                <span style={{ color: strength.color }}>{strength.label}</span>
                            </div>
                            <div style={{ height: 4, borderRadius: 2, background: "#e5e7eb", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: strength.width, background: strength.color, transition: "all 0.3s ease" }} />
                            </div>
                        </div>
                    )}
                    {errors[field.name] && (
                        <div className="invalid-feedback" style={{ display: "block" }}>{errors[field.name]}</div>
                    )}
                </>
            );
        }

        return (
            <>
                <input
                    type={field.type === "number" ? "text" : field.type || "text"}

                    inputMode={
                        field.type === "number"
                            ? "numeric"
                            : undefined
                    }
                    min={field.type === "number" ? "0" : undefined}
                    {...commonProps}
                />

                {errors[field.name] && (
                    <div className="invalid-feedback">{errors[field.name]}</div>
                )}
            </>
        );
    };

    const visibleTabs = getVisibleTabs();
    const currentTabIndex = visibleTabs.indexOf(activeTab);
    const displayName = form.name || form.menuName || form.franchiseName || form.paymentName || form.orderTypeName || form.taxName || form.leadSourceName || form.documentName || form.materialName || form.packageName || form.itemName || `New ${config.title}`;

    return (
        <>
            <style>{CMF_CSS}</style>
            <div className="page-content">
                <div className="container-fluid">

                    {/* ── Page header ── */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow: "0 4px 14px rgba(217,30,24,0.32)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <i className={`bx ${config.icon}`} style={{ color: "#fff", fontSize: 22 }} />
                                    </div>
                                    <div>
                                        <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>
                                            {mode === "edit" ? `Edit ${config.title}` : `Create ${config.title}`}
                                        </h4>
                                        <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>
                                            Masters · {config.title}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <button type="button" onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                                        <i className="bx bx-arrow-back" style={{ fontSize: 15 }} /> Back
                                    </button>
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item"><Link to={config.listPath}>{config.title}</Link></li>
                                        <li className="breadcrumb-item active">{mode === "edit" ? "Edit" : "Create"}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {success && (
                        <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", color: "#065F46", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600 }}>
                            <i className="bx bx-check-circle" style={{ fontSize: 20, color: "#10B981" }} />
                            {config.title} {mode === "edit" ? "updated" : "created"} successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4 align-items-start">

                            {/* ── Left sidebar ── */}
                            <div className="col-xl-3 col-lg-4 col-12">
                                <div className="cmf-card" style={{ padding: 24, position: "sticky", top: 80 }}>

                                    {/* Avatar / icon */}
                                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                                        <div style={{ position: "relative", display: "inline-block" }}>
                                            {config.imageField && imagePreview ? (
                                                <img src={imagePreview} alt="preview" style={{ width: 72, height: 72, borderRadius: 18, objectFit: "cover", border: "3px solid #fff", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }} />
                                            ) : (
                                                <div style={{ width: 72, height: 72, borderRadius: 18, margin: "0 auto", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(217,30,24,0.28)" }}>
                                                    <i className={`bx ${config.icon}`} style={{ fontSize: 32, color: "#fff" }} />
                                                </div>
                                            )}
                                            {config.imageField && (
                                                <label style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "1.5px solid #e9ecef", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                                                    <i className="bx bxs-camera" style={{ fontSize: 13, color: "#6b7280" }} />
                                                    <input type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                                </label>
                                            )}
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: 15.5, color: "#1A1A1A", lineHeight: 1.3, marginTop: 12 }}>{displayName}</div>
                                        <div style={{ display: "inline-block", marginTop: 6, background: "rgba(217,30,24,0.07)", color: "#D91E18", borderRadius: 7, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{config.title}</div>
                                    </div>

                                    <hr style={{ borderColor: "#f0f0f0", margin: "0 0 16px" }} />

                                    {/* Live preview stats */}
                                    {getSidebarStats().map(({ icon, val }, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                                            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <i className={`bx ${icon}`} style={{ fontSize: 14, color: "#6b7280" }} />
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</div>
                                        </div>
                                    ))}

                                    {/* Tab completion */}
                                    <hr style={{ borderColor: "#f0f0f0", margin: "14px 0 12px" }} />
                                    <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Completion</div>
                                    {visibleTabs.map((tab) => {
                                        const isDone = getTabDone(tab);
                                        return (
                                            <div key={tab} onClick={() => switchTab(tab)} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9, cursor: "pointer", borderRadius: 8, padding: "4px 6px", background: activeTab === tab ? "rgba(217,30,24,0.05)" : "transparent", transition: "background 0.15s" }}>
                                                <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: isDone ? "linear-gradient(135deg,#D91E18,#F97316)" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", boxShadow: isDone ? "0 2px 6px rgba(217,30,24,0.28)" : "none" }}>
                                                    {isDone ? <i className="bx bx-check" style={{ fontSize: 11, color: "#fff" }} /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d1d5db" }} />}
                                                </div>
                                                <span style={{ fontSize: 12.5, fontWeight: 600, color: activeTab === tab ? "#D91E18" : isDone ? "#374151" : "#9ca3af" }}>{formatLabel(tab)}</span>
                                            </div>
                                        );
                                    })}

                                    <hr style={{ borderColor: "#f0f0f0", margin: "14px 0" }} />

                                    {/* Save */}
                                    <button type="submit" disabled={submitting}
                                        style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(217,30,24,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, opacity: submitting ? 0.8 : 1, transition: "all 0.18s", fontFamily: "inherit" }}>
                                        {submitting
                                            ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14, borderWidth: 2 }} />{mode === "edit" ? "Updating…" : "Saving…"}</>
                                            : <><i className="bx bx-save" style={{ fontSize: 16 }} />{mode === "edit" ? "Update Record" : "Save Record"}</>}
                                    </button>

                                    {/* Cancel */}
                                    <Link to={config.listPath}
                                        style={{ display: "block", padding: "11px", borderRadius: 10, border: "1.5px solid #e9ecef", background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 13, textDecoration: "none", textAlign: "center", transition: "all 0.15s" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f3f4f6"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e9ecef"; e.currentTarget.style.background = "#f9fafb"; }}>
                                        <i className="bx bx-arrow-back me-1" />Cancel
                                    </Link>
                                </div>
                            </div>

                            {/* ── Right: tabs + form ── */}
                            <div className="col-xl-9 col-lg-8 col-12">
                                <div className="cmf-card" style={{ overflow: "hidden", padding: 0 }}>

                                    {/* Tab navigation */}
                                    <div style={{ display: "flex", gap: 4, padding: "14px 20px", background: "#fafafa", borderBottom: "1px solid #f0f0f0", overflowX: "auto" }}>
                                        {visibleTabs.map((tab) => {
                                            const active = activeTab === tab;
                                            const isDone = getTabDone(tab);
                                            return (
                                                <button key={tab} type="button" className="cmf-tab-btn"
                                                    onClick={() => switchTab(tab)}
                                                    style={{ background: active ? "linear-gradient(135deg,#D91E18 0%,#F97316 100%)" : isDone ? "rgba(217,30,24,0.06)" : "transparent", color: active ? "#fff" : isDone ? "#D91E18" : "#6b7280", boxShadow: active ? "0 4px 14px rgba(217,30,24,0.28)" : "none", transform: active ? "scale(1.02)" : "scale(1)" }}>
                                                    {TAB_ICONS[tab] && <i className={`bx ${TAB_ICONS[tab]}`} style={{ fontSize: 16 }} />}
                                                    {formatLabel(tab)}
                                                    {isDone && (
                                                        <span style={{ width: 15, height: 15, borderRadius: "50%", background: active ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg,#D91E18,#F97316)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>
                                                            <i className="bx bx-check" style={{ fontSize: 10, color: active ? "#fff" : "#fff" }} />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Animated form content */}
                                    <div style={{ padding: "28px 28px 24px", opacity: tabVisible ? 1 : 0, transform: tabVisible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.16s ease, transform 0.16s ease" }}>
                                        <div className="row g-3">
                                            {config.fields[activeTab]
                                                ?.filter((field) => !field.showIf || field.showIf(form))
                                                .map((field) => (
                                                    <div key={field.name} className={`col-md-${field.col || (["switch", "checkbox"].includes(field.type) ? 12 : 6)}`}>
                                                        {!["switch", "checkbox", "combo-builder", "menu-price-preview"].includes(field.type) && (
                                                            <label className="cmf-label">
                                                                {module === "package" && field.name === "royaltyValue"
                                                                    ? (form.royaltyType === "PERCENTAGE" ? "Royalty %" : "Royalty Amount")
                                                                    : field.label}
                                                                {field.required && <span style={{ color: "#D91E18", marginLeft: 3 }}>*</span>}
                                                            </label>
                                                        )}
                                                        {renderField(field)}
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Bottom prev / next */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
                                            <button type="button"
                                                onClick={() => currentTabIndex > 0 && switchTab(visibleTabs[currentTabIndex - 1])}
                                                disabled={currentTabIndex === 0}
                                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e9ecef", background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 13, cursor: currentTabIndex === 0 ? "not-allowed" : "pointer", opacity: currentTabIndex === 0 ? 0.35 : 1, transition: "all 0.15s", fontFamily: "inherit" }}>
                                                <i className="bx bx-chevron-left" style={{ fontSize: 16 }} />Previous
                                            </button>

                                            {currentTabIndex < visibleTabs.length - 1 ? (
                                                <button type="button" onClick={() => switchTab(visibleTabs[currentTabIndex + 1])}
                                                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 3px 12px rgba(217,30,24,0.25)", transition: "all 0.18s", fontFamily: "inherit" }}>
                                                    Next<i className="bx bx-chevron-right" style={{ fontSize: 16 }} />
                                                </button>
                                            ) : (
                                                <button type="button" onClick={handleSubmit} disabled={submitting}
                                                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 3px 12px rgba(217,30,24,0.25)", opacity: submitting ? 0.8 : 1, transition: "all 0.18s", fontFamily: "inherit" }}>
                                                    {submitting
                                                        ? <><span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13, borderWidth: 2 }} />{mode === "edit" ? "Updating…" : "Saving…"}</>
                                                        : <><i className="bx bx-save" style={{ fontSize: 15 }} />{mode === "edit" ? "Update Record" : "Save Record"}</>}
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
        </>
    );
};

export default CommonMasterForm;