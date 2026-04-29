const express = require("express");
const router = express.Router();

const {
  createPaymentMode,
  getPaymentModes,
  getPaymentModeById,
  updatePaymentMode,
  deletePaymentMode,
} = require("../../controllers/masterController/paymentModeController");

router.post("/", createPaymentMode);
router.get("/", getPaymentModes);
router.get("/:id", getPaymentModeById);
router.put("/:id", updatePaymentMode);
router.delete("/:id", deletePaymentMode);

module.exports = router;
