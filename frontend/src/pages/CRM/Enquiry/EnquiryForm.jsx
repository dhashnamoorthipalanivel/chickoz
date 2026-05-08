import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEnquiryStore, useLeadSources, usePackageStore } from "../../../store/store";
import { toast } from "react-toastify";

const formatLabel = (value) => {
    return value
        ?.toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ENQUIRY_CONFIG = {
    title: "Enquiry",
    listPath: "/crm-enquiry",
    icon: "bx-user-voice",
    tabs: ["basic", "lead", "followup"],
    fields: {
        basic: [
            { name: "referenceId", label: "Reference ID", type: "text", required: true, placeholder: "Enter reference ID", maxLength: 50, disabled: true },
            { name: "name", label: "Name", type: "text", required: true, placeholder: "Enter customer name", maxLength: 100 },
            { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "Enter phone number", maxLength: 10 },
            { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email address", maxLength: 100 },
            { name: "place", label: "Place", type: "text", required: true, placeholder: "Enter place / city", maxLength: 100 },
            { name: "address", label: "Address", type: "textarea", placeholder: "Enter address", col: 12, maxLength: 500 },
        ],

        lead: [
            {
                name: "interestedPackage",
                label: "Interested Package",
                type: "select",
                required: true,
                // options: ["STARTER_PACKAGE", "PROFESSIONAL_PACKAGE", "ENTERPRISE_PACKAGE", "CUSTOM_PACKAGE"],
            },
            {
                name: "leadSource",
                label: "Lead Source",
                type: "select",
                required: true,
                // options: ["WEBSITE", "INSTAGRAM", "FACEBOOK", "REFERENCE", "WALK_IN"],
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: ["NEW", "FOLLOW_UP", "HOLD", "CANCELLED"],
            },
            {
                name: "assignedTo",
                label: "Assigned To",
                type: "text",
                required: true,
                placeholder: "Enter staff / sales person name",
                maxLength: 100,
            },
        ],

        followup: [
            { name: "followUpDate", label: "Follow-up Date", type: "date", required: true },
            { name: "createdDate", label: "Created Date", type: "date", required: true, disabled: true },
            { name: "remarks", label: "Remarks / Notes", type: "textarea", placeholder: "Enter notes or follow-up remarks", col: 12, maxLength: 1000 },
        ],
    },

    initialValues: {
        referenceId: "",
        name: "",
        phone: "",
        email: "",
        place: "",
        address: "",
        interestedPackage: "",
        leadSource: "",
        status: "NEW",
        followUpDate: "",
        assignedTo: "",
        createdDate: new Date().toISOString().split("T")[0],
        remarks: "",
    },
};

const EnquiryForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const mode = id ? "edit" : "add";
    const initialData = location.state?.rowData || {};
    const config = ENQUIRY_CONFIG;

    const [activeTab, setActiveTab] = useState(config.tabs[0]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const { leadSources, fetchLeadSources } = useLeadSources();
    const { packages, fetchPackages } = usePackageStore();
    const { createEnquiry, getNextReferenceId, updateEnquiry } = useEnquiryStore();

    useEffect(() => {
        fetchLeadSources();
        fetchPackages();
    }, [])

    useEffect(() => {
        const loadId = async () => {
            const res = await getNextReferenceId();

            setForm((prev) => ({
                ...prev,
                referenceId: res.referenceId,
            }));
        };

        if (mode === "add") {
            loadId();
        }
    }, [mode]);

    const mergedInitialValues = useMemo(() => {
        return {
            ...config.initialValues,
            ...initialData,

            interestedPackage:
                initialData.interestedPackage?._id ||
                initialData.interestedPackage ||
                "",

            leadSource:
                initialData.leadSource?._id ||
                initialData.leadSource ||
                "",

            followUpDate: initialData.followUpDate
                ? new Date(initialData.followUpDate)
                    .toISOString()
                    .split("T")[0]
                : "",

            createdDate: initialData.createdAt
                ? new Date(initialData.createdAt)
                    .toISOString()
                    .split("T")[0]
                : config.initialValues.createdDate,
        };
    }, [initialData]);

    const [form, setForm] = useState(() => mergedInitialValues);

    useEffect(() => {
        setForm(mergedInitialValues);
        setErrors({});
        setSuccess(false);
        setActiveTab("basic");
    }, [id]);

    // ✅ ONLY SAVE BUTTON VALIDATION
    const validate = () => {
        const e = {};

        config.tabs.forEach((tab) => {
            config.fields[tab]?.forEach((field) => {
                if (field.required && !form[field.name]?.toString().trim()) {
                    e[field.name] = `${field.label} is required`;
                }

                if (field.type === "email" && form[field.name]) {
                    if (!/\S+@\S+\.\S+/.test(form[field.name])) {
                        e[field.name] = "Enter a valid email address";
                    }
                }
            });
        });

        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let fieldConfig = null;
        for (const tab of config.tabs) {
            const field = config.fields[tab]?.find((f) => f.name === name);
            if (field) {
                fieldConfig = field;
                break;
            }
        }

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "");
            setForm((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else if (fieldConfig?.type === "email") {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }


        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errs = validate();

        if (Object.keys(errs).length > 0) {
            setErrors(errs);

            const firstTabWithError = config.tabs.find((tab) =>
                config.fields[tab]?.some((field) => errs[field.name])
            );

            if (firstTabWithError) setActiveTab(firstTabWithError);
            return;
        }

        try {
            setSubmitting(true);

            // 🔥 IMPORTANT: send only required fields
            const payload = {
                name: form.name,
                phone: form.phone,
                email: form.email,
                place: form.place,
                address: form.address,
                interestedPackage: form.interestedPackage,
                leadSource: form.leadSource,
                status: form.status,
                followUpDate: form.followUpDate,
                assignedTo: form.assignedTo,
                remarks: form.remarks,
            };

            console.log("payload: ", payload)

            // 🔥 CALL ZUSTAND

            if (mode === "add") {
                const response = await createEnquiry(payload);
                toast.success("Enquiry created successfully");
                console.log("response : ", response);
            } else {
                const response = await updateEnquiry(initialData._id, payload);
                toast.success("Enquiry updated successfully");
                console.log("response : ", response);
            }


            setTimeout(() => {
                navigate(config.listPath);
            }, 1000);

        } catch (err) {
            console.error(err);
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong";

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Next button handler - NO validation, NO form submit
    const handleNext = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling
        if (currentTabIndex < config.tabs.length - 1) {
            setActiveTab(config.tabs[currentTabIndex + 1]);
        }
    };

    // ✅ Previous button handler
    const handlePrevious = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling
        if (currentTabIndex > 0) {
            setActiveTab(config.tabs[currentTabIndex - 1]);
        }
    };

    const renderField = (field) => {
        const commonProps = {
            name: field.name,
            value: form[field.name] ?? "",
            onChange: handleChange,
            className: `form-control ${errors[field.name] ? "is-invalid" : ""}`,
            placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
            maxLength: field.maxLength,
            disabled: field.disabled || false,
            autoComplete: "off",
        };

        if (field.type === "textarea") {
            return (
                <>
                    <textarea {...commonProps} rows="3" />
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        if (field.type === "select") {

            // 🔥 Package dropdown
            if (field.name === "interestedPackage") {
                return (
                    <>
                        <select
                            name={field.name}
                            value={form[field.name] ?? ""}
                            onChange={handleChange}
                            className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                        >
                            <option value="">Select Package</option>

                            {packages.map((pkg) => (
                                <option key={pkg._id} value={pkg._id}>
                                    {pkg.packageName}
                                </option>
                            ))}
                        </select>
                        {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                    </>
                );
            }

            // 🔥 Lead Source dropdown
            if (field.name === "leadSource") {
                return (
                    <>
                        <select
                            name={field.name}
                            value={form[field.name] ?? ""}
                            onChange={handleChange}
                            className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                        >
                            <option value="">Select Lead Source</option>

                            {leadSources.map((src) => (
                                <option key={src._id} value={src._id}>
                                    {src.leadSourceName}
                                </option>
                            ))}
                        </select>
                        {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                    </>
                );
            }

            // default select (if any)
            return (
                <>
                    <select
                        name={field.name}
                        value={form[field.name] ?? ""}
                        onChange={handleChange}
                        className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                    >
                        <option value="">Select {field.label}</option>
                        {[
                            ...field.options,

                            ...(form.status === "CONVERTED_TO_LEAD"
                                ? ["CONVERTED_TO_LEAD"]
                                : []),
                        ].map((option) => (

                            <option
                                key={option}
                                value={option}
                            >
                                {formatLabel(option)}
                            </option>
                        ))}
                    </select>
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        return (
            <>
                <input type={field.type || "text"} {...commonProps} />
                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
            </>
        );
    };

    const currentTabIndex = config.tabs.indexOf(activeTab);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">
                                    {mode === "edit" ? "Edit Enquiry" : "Create Enquiry"}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to={config.listPath}>Enquiry List</Link>
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
                                <strong>Success!</strong> Enquiry {mode === "edit" ? "updated" : "created"} successfully.
                            </div>
                        </div>
                    )}

                    {/* ✅ noValidate important */}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header p-0 border-bottom-0">
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            {config.tabs.map((tab) => (
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
                                            {config.fields[activeTab]?.map((field) => (
                                                <div key={field.name} className={`col-md-${field.col || 6}`}>
                                                    <label className="form-label">
                                                        {field.label}{" "}
                                                        {field.required && <span className="text-danger">*</span>}
                                                    </label>
                                                    {renderField(field)}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="d-flex justify-content-between mt-4 flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handlePrevious}
                                                disabled={currentTabIndex === 0}
                                            >
                                                <i className="bx bx-chevron-left me-1"></i> Previous
                                            </button>

                                            <div className="d-flex gap-2 flex-wrap">
                                                <Link to={config.listPath} className="btn btn-outline-secondary">
                                                    <i className="bx bx-arrow-back me-1"></i> Cancel
                                                </Link>

                                                {currentTabIndex < config.tabs.length - 1 ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={handleNext}
                                                    >
                                                        Next <i className="bx bx-chevron-right ms-1"></i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={submitting}
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
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default EnquiryForm;