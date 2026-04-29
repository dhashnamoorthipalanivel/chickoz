const express = require("express");
const {
  createMenu,
  getMenus,
  getNonComboMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} = require("../../../controllers/masterController/menu/menuItemController");
const router = express.Router();

// CREATE
router.post("/", createMenu);

// GET ALL
router.get("/", getMenus);

// GET ONLY NON-COMBO MENUS (for combo builder)
router.get("/non-combo", getNonComboMenus);

// GET SINGLE
router.get("/:id", getMenuById);

// UPDATE
router.put("/:id", updateMenu);

// SOFT DELETE
router.delete("/:id", deleteMenu);

module.exports = router;
