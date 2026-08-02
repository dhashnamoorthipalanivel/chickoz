const express = require("express");
const router = express.Router();
const {
  createVendor,
  getAllVendors,
  getSingleVendor,
  updateVendor,
  deleteVendor,
} = require("../../controllers/masterController/vendorController");
const { protect } = require("../../middleware/authMiddleware");

router.post("/create", protect, createVendor);
router.get("/all", protect, getAllVendors);
router.get("/:id", protect, getSingleVendor);
router.put("/update/:id", protect, updateVendor);
router.delete("/delete/:id", protect, deleteVendor);

module.exports = router;
