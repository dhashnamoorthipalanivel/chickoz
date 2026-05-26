import { create } from "zustand";
import {
  createPackage,
  deletePackage,
  getPackageById,
  getPackages,
  updatePackage,
} from "../api/packageApi";
import { createTax, deleteTax, getTaxes, updateTax } from "../api/taxApi";
import {
  createMasalaItem,
  deleteMasalaItem,
  getMasalaItems,
  updateMasalaItem,
} from "../api/masalaItemApi";
import {
  createPaymentMode,
  deletePaymentMode,
  getPaymentModes,
  updatePaymentMode,
} from "../api/paymentModesApi";
import {
  createOrderType,
  deleteOrderType,
  getOrderTypes,
  updateOrderType,
} from "../api/orderTypeApi";
import {
  createLeadSource,
  deleteLeadSource,
  getLeadSources,
  updateLeadSource,
} from "../api/leadSourceApi";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../api/documentApi";
import {
  createMenu,
  deleteMenu,
  getMenus,
  getNonComboMenus,
  updateMenu,
} from "../api/menuItemApi";
import {
  convertToLead,
  createEnquiry,
  deleteEnquiry,
  getEnquiries,
  getNextReferenceId,
  updateEnquiry,
} from "../api/enquiryApi";
import { getLeadById, getLeads, updateLead } from "../api/leadApi";
import { getKishokById, getKishoks, updateKishok } from "../api/kishokApi";
import {
  getFranchiseById,
  getFranchises,
  sendFranchiseInvitation,
  updateFranchise,
} from "../api/franchiseApi";
import {
  getMyMenus,
  updateAssignedMenus,
  updateMenuVisibility,
} from "../api/franchiseMenuApi";
import {
  getMe,
  sendChangePasswordOtpApi,
  verifyChangePasswordOtpApi,
} from "../api/authAPI";
import {
  createMasalaRequest,
  getAllMasalaRequests,
  getMyMasalaRequests,
  getSingleMasalaRequest,
  updateMasalaRequest,
  updateMasalaRequestStatus,
} from "../api/masalaRequestApi";
import { createCustomerApi, getCustomerByMobileApi, getFranchiseCustomersApi } from "../api/customerApi";

// Package
export const usePackageStore = create((set) => ({
  packages: [],
  loading: false,
  singlePackage: [],

  fetchPackages: async () => {
    set({ loading: true });
    const res = await getPackages();
    set({ packages: res.data, loading: false });
  },

  addPackage: async (data) => {
    const res = await createPackage(data);
    return res.data;
  },

  updatePackage: async (id, data) => {
    const res = await updatePackage(id, data);
    return res.data;
  },

  deletePackage: async (id) => {
    const res = await deletePackage(id);
    return res.data;
  },
}));

// Tax
export const useTaxStore = create((set) => ({
  taxes: [],
  loading: false,

  fetchTaxes: async () => {
    set({ loading: true });
    const res = await getTaxes();
    set({ taxes: res.data, loading: false });
  },

  addTax: async (data) => {
    const res = await createTax(data);
    return res.data;
  },

  updateTax: async (id, data) => {
    const res = await updateTax(id, data);
    return res.data;
  },

  deleteTax: async (id) => {
    const res = await deleteTax(id);
    return res.data;
  },
}));

// Masala Items

export const useMasalaItems = create((set) => ({
  masalaItems: [],
  loading: false,

  fetchMasalaItems: async () => {
    set({ loading: true });
    const res = await getMasalaItems();
    set({ masalaItems: res.data, loading: false });
  },

  addMasalaItem: async (data) => {
    const res = await createMasalaItem(data);
    return res.data;
  },

  updateMasalaItem: async (id, data) => {
    const res = await updateMasalaItem(id, data);
    return res.data;
  },

  deleteMasalaItem: async (id) => {
    const res = await deleteMasalaItem(id);
    return res.data;
  },
}));

// Payment mode

export const usePaymentModes = create((set) => ({
  paymentModes: [],
  loading: false,

  fetchPaymentModes: async () => {
    set({ loading: true });
    const res = await getPaymentModes();
    set({ paymentModes: res.data, loading: false });
  },

  addPaymentMode: async (data) => {
    const res = await createPaymentMode(data);
    return res.data;
  },

  updatePaymentMode: async (id, data) => {
    const res = await updatePaymentMode(id, data);
    return res.data;
  },

  deletePaymentMode: async (id) => {
    const res = await deletePaymentMode(id);
    return res.data;
  },
}));

// Order Type
export const useOrderTypes = create((set) => ({
  orderTypes: [],
  loading: false,

  fetchOrderTypes: async () => {
    set({ loading: true });
    const res = await getOrderTypes();
    set({ orderTypes: res.data, loading: false });
  },

  addOrderType: async (data) => {
    const res = await createOrderType(data);
    return res.data;
  },

  updateOrderType: async (id, data) => {
    const res = await updateOrderType(id, data);
    return res.data;
  },

  deleteOrderType: async (id) => {
    const res = await deleteOrderType(id);
    return res.data;
  },
}));

// Lead source
export const useLeadSources = create((set) => ({
  leadSources: [],
  loading: false,

  fetchLeadSources: async () => {
    set({ loading: true });
    const res = await getLeadSources();
    set({ leadSources: res.data, loading: false });
  },

  addLeadSource: async (data) => {
    const res = await createLeadSource(data);
    return res.data;
  },

  updateLeadSource: async (id, data) => {
    const res = await updateLeadSource(id, data);
    return res.data;
  },

  deleteLeadSource: async (id) => {
    const res = await deleteLeadSource(id);
    return res.data;
  },
}));

// Documents
export const useDocuments = create((set) => ({
  documents: [],
  loading: false,

  fetchDocuments: async () => {
    set({ loading: true });
    const res = await getDocuments();
    set({ documents: res.data, loading: false });
  },

  addDocument: async (data) => {
    const res = await createDocument(data);
    return res.data;
  },

  updateDocument: async (id, data) => {
    const res = await updateDocument(id, data);
    return res.data;
  },

  deleteDocument: async (id) => {
    const res = await deleteDocument(id);
    return res.data;
  },
}));

// Menu items

export const useMenuItems = create((set) => ({
  menuItems: [],
  nonComboMenuItems: [],
  loading: false,

  fetchMenuItems: async () => {
    set({ loading: true });
    const res = await getMenus();
    set({ menuItems: res.data, loading: false });
  },

  fetchNonComboMenuItems: async () => {
    set({ loading: true });
    const res = await getNonComboMenus();
    set({ nonComboMenuItems: res.data, loading: false });
  },

  addMenuItem: async (data) => {
    const res = await createMenu(data);
    return res.data;
  },

  updateMenuItem: async (id, data) => {
    const res = await updateMenu(id, data);
    return res.data;
  },

  deleteMenuItem: async (id) => {
    const res = await deleteMenu(id);
    return res.data;
  },
}));

// CRM

export const useEnquiryStore = create((set) => ({
  enquiries: [],
  loading: false,

  // GET
  fetchEnquiries: async () => {
    set({ loading: true });

    try {
      const res = await getEnquiries();
      set({ enquiries: res.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },

  // CREATE
  createEnquiry: async (payload) => {
    try {
      const res = await createEnquiry(payload);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // DELETE
  deleteEnquiry: async (id) => {
    try {
      const res = await deleteEnquiry(id);
      return res.data;

      set((state) => ({
        enquiries: state.enquiries.filter((e) => e._id !== id),
      }));

      return res.data;
    } catch (err) {
      console.error(err);
    }
  },

  updateEnquiry: async (id, payload) => {
    try {
      const res = await updateEnquiry(id, payload);
      set((state) => ({
        enquiries: state.enquiries.map((e) => (e._id === id ? res.data : e)),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // CONVERT
  convertToLead: async (id) => {
    try {
      const res = await convertToLead(id);
      return res.data;

      // 🔥 Update only that row (no refetch needed)
      set((state) => ({
        enquiries: state.enquiries.map((e) =>
          e._id === id
            ? {
                ...e,
                status: "CONVERTED_TO_LEAD",
                isConverted: true,
              }
            : e,
        ),
      }));

      return res.data;
    } catch (err) {
      console.error(err);
    }
  },

  getNextReferenceId: async () => {
    try {
      const res = await getNextReferenceId();

      console.log("res:", res);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  },
}));

export const useLeadStore = create((set) => ({
  leads: [],

  selectedLead: null,

  fetchLeads: async () => {
    try {
      const res = await getLeads();

      set({
        leads: res.data,
      });
    } catch (err) {
      console.error(err);
    }
  },
  fetchLeadById: async (id) => {
    try {
      const res = await getLeadById(id);

      set({
        selectedLead: res.data,
      });

      return res.data;
    } catch (err) {
      console.error(err);
    }
  },
  updateLead: async (id, payload) => {
    try {
      const res = await updateLead(id, payload);

      set((state) => ({
        leads: state.leads.map((lead) =>
          lead._id === id ? res.data.lead : lead,
        ),
      }));

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
}));

// Kishok
export const useKishokStore = create((set) => ({
  kishoks: [],
  kishok: null,
  loading: false,

  // ✅ GET ALL
  fetchKishoks: async () => {
    try {
      set({ loading: true });
      const res = await getKishoks();
      set({
        kishoks: res.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ✅ GET SINGLE
  fetchKishokById: async (id) => {
    try {
      set({ loading: true });
      const res = await getKishokById(id);
      set({
        kishok: res.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ✅ UPDATE
  saveKishok: async (id, data) => {
    try {
      set({ loading: true });
      const res = await updateKishok(id, data);
      set({
        kishok: res.data.data,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },
}));

// franchise

export const useFranchiseStore = create((set) => ({
  franchises: [],
  franchise: null,
  loading: false,

  // ======================
  // GET ALL
  // ======================

  fetchFranchises: async () => {
    set({
      loading: true,
    });

    try {
      const res = await getFranchises();
      set({
        franchises: res.data,
        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },

  // ======================
  // GET SINGLE
  // ======================

  fetchFranchiseById: async (id) => {
    try {
      console.log("FETCH ID:", id);

      const res = await getFranchiseById(id);

      console.log("FRANCHISE API RESPONSE:", res.data);

      set({
        franchise: res.data,
      });

      return res.data;
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  },

  // ======================
  // UPDATE
  // ======================

  saveFranchise: async (id, data) => {
    try {
      const res = await updateFranchise(id, data);

      return res.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  sendInvitation: async (id) => {
    try {
      const res = await sendFranchiseInvitation(id);

      return res.data;
    } catch (error) {
      throw error;
    }
  },
}));

// Franchise Menu
export const useFranchiseMenuStore = create((set) => ({
  // ✅ COMMON
  loading: false,

  // ✅ FRANCHISE MENUS
  menus: [],

  // =====================================
  // ADMIN SIDE
  // SAVE ASSIGNED MENUS
  // =====================================

  saveAssignedMenus: async (id, data) => {
    try {
      set({
        loading: true,
      });

      const res = await updateAssignedMenus(id, data);

      return res.data;
    } catch (error) {
      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // =====================================
  // FRANCHISE SIDE
  // GET MY MENUS
  // =====================================

  fetchMyMenus: async () => {
    try {
      set({
        loading: true,
      });

      const res = await getMyMenus();

      set({
        menus: res.data.menus,

        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },

  updateVisibility: async (data) => {
    try {
      set({
        loading: true,
      });

      await updateMenuVisibility(data);

      // ✅ REFRESH MENUS
      const res = await getMyMenus();

      set({
        menus: res.data.menus,

        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },
}));

// profile
export const useAuthStore = create((set) => ({
  profile: null,
  franchise: null,
  loading: false,

  clearProfile: () =>
    set({
      profile: null,
      franchise: null,
    }),

  fetchProfile: async () => {
    try {
      set({
        loading: true,
      });

      const res = await getMe();

      console.log("data:", res.data);

      set({
        profile: res.data.user,
        franchise: res.data.franchise,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      set({
        loading: false,
      });
    }
  },

  sendChangePasswordOtp: async (payload) => {
    try {
      const response = await sendChangePasswordOtpApi(payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyChangePasswordOtp: async (payload) => {
    try {
      const response = await verifyChangePasswordOtpApi(payload);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));

// Customer

export const useCustomerStore = create((set) => ({
  customer: null,
  customerLoading: false,
  // CREATE CUSTOMER
  createCustomer: async (payload) => {
    try {
      set({
        customerLoading: true,
      });

      const response = await createCustomerApi(payload);

      set({
        customer: response.customer,

        customerLoading: false,
      });

      return response;
    } catch (error) {
      set({
        customerLoading: false,
      });

      throw error;
    }
  },

  // GET CUSTOMER
  getCustomerByMobile: async (mobile, franchiseId) => {
    try {
      set({
        customerLoading: true,
      });

      const response = await getCustomerByMobileApi(mobile, franchiseId);

      set({
        customer: response.customer,
        customerLoading: false,
      });

      return response;
    } catch (error) {
      set({
        customer: null,
        customerLoading: false,
      });

      throw error;
    }
  },

  getFranchiseCustomers: async (franchiseId) => {

    const response = await getFranchiseCustomersApi(
            franchiseId
        );

    return response.customers;
},

}));

// Masala request
// ======================================================
// MASALA REQUEST STORE
// ======================================================

export const useMasalaRequestStore = create((set) => ({
  requests: [],

  singleRequest: null,

  loading: false,

  // ======================================================
  // CREATE REQUEST
  // ======================================================
  createRequest: async (payload) => {
    try {
      set({
        loading: true,
      });

      const res = await createMasalaRequest(payload);

      set({
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
      });

      console.log(error);

      throw error;
    }
  },

  // ======================================================
  // GET MY REQUESTS
  // ======================================================
  fetchMyRequests: async () => {
    try {
      set({
        loading: true,
      });

      const res = await getMyMasalaRequests();

      set({
        requests: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },

  // ======================================================
  // GET SINGLE REQUEST
  // ======================================================
  fetchSingleRequest: async (id) => {
    try {
      set({
        loading: true,
      });

      const res = await getSingleMasalaRequest(id);

      set({
        singleRequest: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },

  // ======================================================
  // ADMIN GET ALL REQUESTS
  // ======================================================
  fetchAllRequests: async (params) => {
    try {
      set({
        loading: true,
      });

      const res = await getAllMasalaRequests(params);

      set({
        requests: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },

  // ======================================================
  // UPDATE REQUEST
  // ======================================================
  editRequest: async (id, payload) => {
    try {
      set({
        loading: true,
      });

      const res = await updateMasalaRequest(id, payload);

      set({
        loading: false,
      });

      return res.data;
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });

      throw error;
    }
  },

  // ======================================================
  // ADMIN UPDATE STATUS
  // ======================================================
  updateRequestStatus: async (id, payload) => {
    try {
      set({
        loading: true,
      });

      const res = await updateMasalaRequestStatus(id, payload);

      set({
        loading: false,
      });

      return res.data;
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });

      throw error;
    }
  },
}));
