const express    = require("express");
const router     = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getEnquiryReport,
  getLeadReport,
  getFranchiseReport,
  getMasalaReport,
  getOrderReport,
  getSalesReport,
  getFranchiseMasalaReport,
  getItemReport,
  getFranchiseList,
} = require("../controllers/reportController");

router.use(protect);

/* Admin-only reports */
router.get("/admin/enquiries", getEnquiryReport);
router.get("/admin/leads",     getLeadReport);
router.get("/admin/franchises",getFranchiseReport);
router.get("/admin/masala",    getMasalaReport);

/* Franchise reports (admin passes ?franchiseId=, franchise user uses JWT) */
router.get("/franchise/orders", getOrderReport);
router.get("/franchise/sales",  getSalesReport);
router.get("/franchise/masala", getFranchiseMasalaReport);
router.get("/franchise/items",  getItemReport);

/* Shared */
router.get("/franchises-list",  getFranchiseList);

module.exports = router;
