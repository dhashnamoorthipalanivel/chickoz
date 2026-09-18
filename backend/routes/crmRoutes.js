const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crmController");
const { protect } = require("../middleware/authMiddleware"); // assuming standard auth middleware

// Kanban Pipeline
router.get("/pipeline", protect, crmController.getPipeline);
router.put("/pipeline/move", protect, crmController.moveLead);

// Dashboard Stats
router.get("/dashboard-stats", protect, crmController.getDashboardStats);

// Activity Hub
router.get("/activities/:leadId", protect, crmController.getActivities);
router.post("/activities", protect, crmController.addActivity);

// Social Media Webhooks (no protect middleware, usually secured via secret tokens in real world)
router.post("/webhooks/social-media", crmController.socialMediaWebhook);

module.exports = router;
