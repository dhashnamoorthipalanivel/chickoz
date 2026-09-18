const express = require("express");
const router = express.Router();
const integrationController = require("../controllers/integrationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, integrationController.getIntegrations);
router.post("/configure", protect, integrationController.configureIntegration);

module.exports = router;
