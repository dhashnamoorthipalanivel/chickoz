const express = require("express");

const router = express.Router();

const {
  updateAssignedMenus,
  getMyMenus,
  updateMenuVisibility,
} = require("../../controllers/masterController/franchiseMenuController");
const { protect } = require("../../middleware/authMiddleware");

// ✅ UPDATE ASSIGNED MENUS
router.put("/:id/menus", updateAssignedMenus);
router.get("/my-menus", protect, getMyMenus);
router.put("/update-visibility", protect, updateMenuVisibility);

module.exports = router;
