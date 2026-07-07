const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAdminDashboard, getFranchiseDashboard, getFranchiseList } = require("../controllers/dashboardController");

router.use(protect);

router.get("/admin",     getAdminDashboard);
router.get("/franchise", getFranchiseDashboard);
router.get("/franchises-list", getFranchiseList);

module.exports = router;
