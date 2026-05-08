import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeadStore } from "../../../store/store";
import LeadWizardForm from "./LeadWizardForm";
import { getLeadById } from "../../../api/leadApi";

const stages = [
  "SITE_VISIT",
  "APPROVAL",
  "TRAINING",
  "PAYMENT",
  "FINAL_SETUP",
];

const initialData = [
  {
    id: 1,
    leadId: "LED001",
    name: "Arun Kumar",
    phone: "9876543210",
    place: "Chennai",
    assignedTo: "Dhash",
    createdDate: "2026-04-07",
    completedStages: ["SITE_VISIT", "WALK_IN"],
  },
  {
    id: 2,
    leadId: "LED002",
    name: "Suresh",
    phone: "9123456780",
    place: "Coimbatore",
    assignedTo: "Raja",
    createdDate: "2026-04-06",
    completedStages: [],
  },
  {
    id: 3,
    leadId: "LED003",
    name: "Karthik",
    phone: "9988776655",
    place: "Madurai",
    assignedTo: "Vicky",
    createdDate: "2026-04-05",
    completedStages: stages,
  },
];

const formatLabel = (value) =>
  value
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getLeadStatus = (completedStages) => {
  if (completedStages.length === 0) return "NOT_STARTED";
  if (completedStages.length === stages.length) return "COMPLETED";
  return "IN_PROGRESS";
};

const statusBadge = (status) => {

  const map = {
    NOT_STARTED:
      "bg-secondary",

    IN_PROGRESS:
      "bg-primary",

    COMPLETED:
      "bg-success",

    HOLD:
      "bg-warning text-dark",

    CANCELLED:
      "bg-danger",

    RETURN:
      "bg-info",
  };

  return (
    <span
      className={`badge ${map[status] ||
        "bg-secondary"
        }`}
    >
      {formatLabel(status)}
    </span>
  );
};

const getCompletedStages =
  (stagesObj) => {

    const completed = [];

    // SITE VISIT
    if (
      stagesObj?.SITE_VISIT
        ?.data?.visitType &&
      stagesObj?.SITE_VISIT
        ?.data?.visitDate &&
      stagesObj?.SITE_VISIT
        ?.data?.location
    ) {
      completed.push(
        "SITE_VISIT"
      );
    }

    // APPROVAL
    if (

  stagesObj?.APPROVAL
    ?.data?.siteStatus ===
      "Approved" &&

  stagesObj?.APPROVAL
    ?.data?.approvalStatus ===
      "Approved" &&

  stagesObj?.APPROVAL
    ?.data?.legalStatus ===
      "Completed"

) {

  completed.push(
    "APPROVAL"
  );
}

    // TRAINING
    if (
      stagesObj?.TRAINING
        ?.data
        ?.trainingStatus ===
      "Completed"
    ) {
      completed.push(
        "TRAINING"
      );
    }

    // PAYMENT
    const total =
      Number(
        stagesObj?.PAYMENT
          ?.data
          ?.totalAmount || 0
      );

    const paid =
      (
        stagesObj?.PAYMENT
          ?.data
          ?.payments || []
      ).reduce(
        (a, b) =>
          a + b.amount,
        0
      );

    if (
      total > 0 &&
      paid >= total
    ) {
      completed.push(
        "PAYMENT"
      );
    }

    // FINAL
    if (
      stagesObj?.FINAL_SETUP
        ?.data
        ?.contractSigned ===
      "Yes"
    ) {
      completed.push(
        "FINAL_SETUP"
      );
    }

    return completed;
};

const Lead = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
 

  const [selectedLead,setSelectedLead] =useState(null);
  const [data, setData] = useState(initialData);

  const { leads, fetchLeads } = useLeadStore();

  useEffect(() => {
    fetchLeads();
  }, [])

  const filtered = leads.filter((row) => {
    const matchSearch =
      (row.name || "")
        .toLowerCase().includes(search.toLowerCase()) ||
      (row.referenceId || "")
        .toLowerCase().includes(search.toLowerCase()) ||
      (row.phone || "")
        .includes(search);;

    const completedStages =
      getCompletedStages(row.stages);

    const leadStatus =
      row.leadStatus === "NEW"
        ? getLeadStatus(completedStages)
        : row.leadStatus;

    const matchStatus =
      statusFilter === "ALL" || leadStatus === statusFilter;

    return matchSearch && matchStatus;
  });


  // const handleOpenLead =
  //   async (id) => {

  //     try {

  //       const res =
  //         await getLeadById(id);

  //       setSelectedLead(
  //         res.data
  //       );
  //     } catch (error) {

  //       console.log(error);
  //     }
  //   };

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex justify-content-between align-items-center">
              <h4>Lead Management</h4>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4 className="card-title">Lead Records</h4>
          </div>

          <div className="card-body">

            {/* Filters */}
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="HOLD">Hold</option>

                  <option value="RETURN">Return</option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "70px" }}>S.No</th>
                    <th>Lead ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Place</th>
                    <th>Current Stage</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Assigned To</th>
                    <th>Created Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, index) => {
                      const completedStages =
                        getCompletedStages(row.stages);

                      const leadStatus =
                        row.leadStatus === "NEW"
                          ? getLeadStatus(completedStages)
                          : row.leadStatus;

                      const currentStage = completedStages.length === 0 ? "SITE_VISIT"
                      : completedStages.length === stages.length ? "COMPLETED": stages[ 
                        completedStages.length];

                      const progress = Math.round(
                        (
                          completedStages.length /
                          stages.length
                        ) * 100
                      );

                      return (
                        <tr key={row._id}>
                          <td>{index + 1}</td>
                          <td>{row.referenceId}</td>
                          <td>{row.name}</td>
                          <td>{row.phone}</td>
                          <td>{row.place}</td>

                          <td>{formatLabel(currentStage)}</td>

                          <td>{statusBadge(leadStatus)}</td>

                          <td style={{ minWidth: "120px" }}>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <small>{progress}%</small>
                          </td>

                          <td>{row.assignedTo}</td>
                          <td>{new Date(row.createdAt)
                            .toLocaleDateString()}</td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              {/* <Link
                                to={`/crm-lead/view/${row.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bx bx-show"></i>
                              </Link> */}

                              {/* <Link
                                to={`/crm-lead/edit/${row.id}`}
                                className="btn btn-sm btn-outline-success"
                              >
                                <i className="bx bx-edit"></i>
                              </Link> */}
                              <Link
                                to={`/crm-lead/${row._id}`}
                                className="btn btn-sm btn-primary"
                              >
                                <i className="bx bx-folder-open me-1"></i>

                                Open
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Lead;