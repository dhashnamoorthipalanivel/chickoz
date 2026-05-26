import api from "./apiClient";

// ======================================================
// CREATE MASALA REQUEST
// ======================================================
export const createMasalaRequest = (data) => {
  const token = localStorage.getItem("token");

  return api.post("/masala-request/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ======================================================
// GET MY REQUESTS
// ======================================================
export const getMyMasalaRequests = () => {
  const token = localStorage.getItem("token");

  return api.get("/masala-request/my-requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ======================================================
// GET SINGLE REQUEST
// ======================================================
export const getSingleMasalaRequest = (id) => {
  const token = localStorage.getItem("token");

  return api.get(`/masala-request/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ======================================================
// ADMIN GET ALL REQUESTS
// ======================================================
export const getAllMasalaRequests = (params) => {
  const token = localStorage.getItem("token");

  return api.get("/masala-request/admin/all", {
    params,

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ======================================================
// UPDATE MASALA REQUEST
// ======================================================
export const updateMasalaRequest = (id, data) => {
  const token = localStorage.getItem("token");

  return api.put(`/masala-request/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ======================================================
// ADMIN UPDATE STATUS
// ======================================================
export const updateMasalaRequestStatus = (id, data) => {
  const token = localStorage.getItem("token");

  return api.patch(`/masala-request/admin/update-status/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
