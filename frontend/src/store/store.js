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
import { createLeadSource, deleteLeadSource, getLeadSources, updateLeadSource } from "../api/leadSourceApi";
import { createDocument, deleteDocument, getDocuments, updateDocument } from "../api/documentApi";
import { createMenu, deleteMenu, getMenus, getNonComboMenus, updateMenu } from "../api/menuItemApi";

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
  menuItems : [],
  nonComboMenuItems : [],
  loading : false,

  fetchMenuItems : async () => {
    set({loading : true});
    const res = await getMenus();
    set({menuItems : res.data, loading : false})
  },

  fetchNonComboMenuItems : async () => {
    set({loading : true});
    const res = await getNonComboMenus();
    set({nonComboMenuItems : res.data, loading : false})
  },

  addMenuItem : async (data) => {
    const res = await createMenu(data);
    return res.data;
  },

  updateMenuItem : async (id, data) => {
    const res = await updateMenu(id, data);
    return res.data;
  },

  deleteMenuItem : async (id) => {
const res = await deleteMenu(id);
return res.data;
  }

}))