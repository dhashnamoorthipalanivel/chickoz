import api from "./apiClient";

export const updateAssignedMenus = (id, data) =>
  api.put(`/franchise-menu/${id}/menus`, data);

// ✅ GET LOGGED FRANCHISE MENUS
export const getMyMenus = async () => {
  const token = localStorage.getItem("token");

  return api.get(
    "/franchise-menu/my-menus",

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// ✅ UPDATE MENU VISIBILITY
export const updateMenuVisibility = async (data) => {
  const token = localStorage.getItem("token");

  return api.put(
    "/franchise-menu/update-visibility",

    data,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
