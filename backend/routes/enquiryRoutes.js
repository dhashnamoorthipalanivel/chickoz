// routes/enquiry.routes.js

const express = require("express");
const router = express.Router();

const enquiryController = require("../controllers/enquiryController");

router.post("/", enquiryController.createEnquiry);
router.get("/", enquiryController.getEnquiries);
router.get("/next-id", enquiryController.getNextReferenceId);
router.get("/:id/followup", enquiryController.getFollowupHistory);
router.post("/:id/followup", enquiryController.addFollowup);
router.get("/:id", enquiryController.getEnquiryById);
router.put("/:id", enquiryController.updateEnquiry);
router.delete("/:id", enquiryController.deleteEnquiry);

// 🔥 Convert
router.post("/convert/:id", enquiryController.convertToLead);

module.exports = router;