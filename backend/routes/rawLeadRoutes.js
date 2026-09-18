const express = require("express");
const router = express.Router();
const rawLeadController = require("../controllers/rawLeadController");
const { protect } = require("../middleware/authMiddleware");

// Used by frontend to view leads
router.get("/pending", protect, rawLeadController.getPendingLeads);

// Used by frontend to convert to an enquiry
router.post("/:id/convert", protect, rawLeadController.convertToEnquiry);

// Webhook for external platforms (Facebook)
router.get("/webhook", rawLeadController.verifyWebhook);
router.post("/webhook", rawLeadController.webhookHandler);

module.exports = router;
