const express = require("express");

const router = express.Router();

const leadController = require("../controllers/leadController");

// ✅ GET ALL
router.get("/", leadController.getLeads);

// ✅ GET ONE
router.get("/:id", leadController.getLeadById);

// ✅ UPDATE
router.put("/:id", leadController.updateLead);

router.post(
  "/create-franchise/:id",
  leadController.createFranchise
);

module.exports = router;
