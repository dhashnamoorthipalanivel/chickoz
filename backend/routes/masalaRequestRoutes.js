const express = require("express");

const router = express.Router();

const {
  createMasalaRequest,
  getMyMasalaRequests,
  getSingleMasalaRequest,
  getAllMasalaRequests,
  updateMasalaRequestStatus,
  updateMasalaRequest,
} = require("../controllers/masalaRequestController");

// AUTH MIDDLEWARE
const { protect } = require("../middleware/authMiddleware");

// ======================================================
// CREATE MASALA REQUEST
// ======================================================
router.post("/create", protect, createMasalaRequest);

// ======================================================
// GET MY REQUESTS
// ======================================================
router.get("/my-requests", protect, getMyMasalaRequests);

// ======================================================
// ADMIN GET ALL REQUESTS
// ======================================================
router.get("/admin/all", protect, getAllMasalaRequests);

// ======================================================
// ADMIN UPDATE STATUS
// ======================================================
const { upload } = require("../utils/upload");

router.patch(
  "/admin/update-status/:id",
  protect,
  upload.single("deliveryDocument"),
  updateMasalaRequestStatus
);

// ======================================================
// UPDATE REQUEST
// ======================================================
router.put("/update/:id", protect, updateMasalaRequest);

// ======================================================
// GET SINGLE REQUEST
// IMPORTANT:
// KEEP DYNAMIC ROUTE ALWAYS LAST
// ======================================================
router.get("/:id", protect, getSingleMasalaRequest);

module.exports = router;
