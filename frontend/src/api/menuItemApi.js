import api from "./apiClient";


// GET ALL MENUS
export const getMenus = () =>
  api.get("/menus");


// GET SINGLE MENU
export const getMenuById = (id) =>
  api.get(`/menus/${id}`);


// GET ONLY NON-COMBO MENUS
export const getNonComboMenus = () =>
  api.get("/menus/non-combo");


// CREATE MENU
export const createMenu = (data) =>
  api.post("/menus", data);


// UPDATE MENU
export const updateMenu = (id, data) =>
  api.put(`/menus/${id}`, data);


// DELETE MENU (soft delete)
export const deleteMenu = (id) =>
  api.delete(`/menus/${id}`);