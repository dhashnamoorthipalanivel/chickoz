const express = require("express");
const router = express.Router();

const {
  createOrderType,
  getOrderTypes,
  getOrderTypeById,
  updateOrderType,
  deleteOrderType,
} = require("../../controllers/masterController/orderTypeController");

router.post("/", createOrderType);
router.get("/", getOrderTypes);
router.get("/:id", getOrderTypeById);
router.put("/:id", updateOrderType);
router.delete("/:id", deleteOrderType);

module.exports = router;
