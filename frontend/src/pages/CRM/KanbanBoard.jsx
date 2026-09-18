import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { toast } from "react-toastify";
import * as Feather from "react-feather";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const STAGES = [
  { id: "LEAD", title: "New Lead", color: "border-primary" },
  { id: "CONTACTED", title: "Contacted", color: "border-info" },
  { id: "PROPOSAL", title: "Proposal", color: "border-warning" },
  { id: "NEGOTIATION", title: "Negotiation", color: "border-secondary" },
  { id: "WON", title: "Won", color: "border-success" },
  { id: "LOST", title: "Lost", color: "border-danger" }
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    LEAD: [], CONTACTED: [], PROPOSAL: [], NEGOTIATION: [], WON: [], LOST: []
  });
  const [loading, setLoading] = useState(true);
  
  // List view state
  const [viewMode, setViewMode] = useState("board");
  const [activeTab, setActiveTab] = useState("LEAD");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const res = await axios.get(`${API_URL}/crm/pipeline`, getHeaders());
      setColumns(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch pipeline data");
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    if (sourceCol === destCol && result.source.index === result.destination.index) {
      return;
    }

    // Optimistic update
    const sourceItems = Array.from(columns[sourceCol]);
    const destItems = Array.from(columns[destCol]);
    const [movedItem] = sourceItems.splice(result.source.index, 1);

    movedItem.pipelineStage = destCol; // Update locally

    if (sourceCol === destCol) {
      sourceItems.splice(result.destination.index, 0, movedItem);
      setColumns({ ...columns, [sourceCol]: sourceItems });
    } else {
      destItems.splice(result.destination.index, 0, movedItem);
      setColumns({ ...columns, [sourceCol]: sourceItems, [destCol]: destItems });
      
      // Update backend
      try {
        await axios.put(`${API_URL}/crm/pipeline/move`, {
          leadId: movedItem._id,
          newStage: destCol
        }, getHeaders());
        toast.success(`Lead moved to ${destCol}`);
      } catch (err) {
        toast.error("Failed to move lead");
        fetchPipeline(); // Revert on failure
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  // Pagination Logic
  const listData = columns[activeTab] || [];
  const totalPages = Math.ceil(listData.length / itemsPerPage);
  const paginatedData = listData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center page-title-box">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather.Trello size={22} color="#fff" />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Pipeline Kanban</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>CRM · Dashboard</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="btn-group shadow-sm bg-white rounded" role="group">
                <button 
                  type="button" 
                  className={`btn btn-sm d-flex align-items-center ${viewMode === 'board' ? 'btn-primary' : 'btn-light text-muted'}`}
                  onClick={() => setViewMode('board')}
                >
                  <Feather.Trello size={14} className="me-1" /> Board
                </button>
                <button 
                  type="button" 
                  className={`btn btn-sm d-flex align-items-center ${viewMode === 'list' ? 'btn-primary' : 'btn-light text-muted'}`}
                  onClick={() => setViewMode('list')}
                >
                  <Feather.List size={14} className="me-1" /> List
                </button>
              </div>
              <Link to="/crm-lead/add" className="btn btn-primary shadow-sm" style={{ display: "flex", alignItems: "center" }}>
                <Feather.Plus size={16} className="me-1" /> Add Lead
              </Link>
            </div>
          </div>
        </div>

        {viewMode === "board" ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="d-flex gap-3 pb-3" style={{ minHeight: "70vh", overflowX: "auto", overflowY: "hidden" }}>
              {STAGES.map((stage) => (
              <div key={stage.id} className="d-flex flex-column" style={{ width: "290px", minWidth: "290px" }}>
                <div className={`card shadow-sm border-top-0 border-end-0 border-bottom-0 border-4 mb-2 ${stage.color}`}>
                  <div className="card-body p-3 d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0 fw-bold">{stage.title}</h6>
                    <span className="badge bg-light text-dark rounded-pill">
                      {columns[stage.id]?.length || 0}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-grow-1 rounded p-2 ${snapshot.isDraggingOver ? 'bg-soft-primary' : 'bg-light'}`}
                      style={{ minHeight: "200px" }}
                    >
                      {columns[stage.id]?.map((lead, index) => (
                        <Draggable key={lead._id} draggableId={lead._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card mb-2 shadow-sm ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              style={{ ...provided.draggableProps.style, cursor: 'grab' }}
                            >
                              <div className="card-body p-3">
                                <div className="d-flex justify-content-between mb-1 align-items-center">
                                  <h6 className="mb-0 fw-bold text-truncate" style={{ maxWidth: "60%" }} title={lead.name}>{lead.name}</h6>
                                  <small className="text-muted text-truncate" style={{ maxWidth: "35%", fontSize: "0.7rem" }} title={lead.referenceId}>{lead.referenceId}</small>
                                </div>
                                <p className="text-muted mb-2 small text-truncate">{lead.phone}</p>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <span className="badge bg-soft-secondary text-secondary text-truncate" style={{ maxWidth: "65%" }}>
                                    {lead.interestedPackage?.name || "No Package"}
                                  </span>
                                  <Link to={`/crm/lead/${lead._id}`} className="btn btn-sm btn-link p-0 text-decoration-none fw-medium">
                                    Details <Feather.ArrowRight size={14} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <ul className="nav nav-tabs border-bottom-0">
                {STAGES.map(stage => (
                  <li className="nav-item" key={stage.id}>
                    <button 
                      className={`nav-link border-0 fw-medium ${activeTab === stage.id ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                      onClick={() => { setActiveTab(stage.id); setCurrentPage(1); }}
                      style={{ background: "transparent" }}
                    >
                      {stage.title} <span className="badge bg-light text-dark ms-1">{columns[stage.id]?.length || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Lead Details</th>
                      <th>Contact</th>
                      <th>Package</th>
                      <th>Created At</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-5 text-muted">No leads in this stage.</td></tr>
                    ) : (
                      paginatedData.map(lead => (
                        <tr key={lead._id}>
                          <td className="ps-4">
                            <h6 className="mb-0 fw-bold">{lead.name}</h6>
                            <small className="text-muted">{lead.referenceId}</small>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Feather.Phone size={14} className="text-muted" /> {lead.phone}
                            </div>
                            {lead.email && <div className="d-flex align-items-center gap-2 mt-1"><Feather.Mail size={14} className="text-muted" /> <small>{lead.email}</small></div>}
                          </td>
                          <td>
                            <span className="badge bg-soft-secondary text-secondary">
                              {lead.interestedPackage?.name || "No Package"}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">{new Date(lead.createdAt).toLocaleDateString()}</small>
                          </td>
                          <td className="text-end pe-4">
                            <Link to={`/crm/lead/${lead._id}`} className="btn btn-sm btn-light">View Details</Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                  <small className="text-muted">Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, listData.length)} of {listData.length} entries</small>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(c => Math.max(1, c - 1))}>Prev</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}>Next</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
