const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

router.use(protect);

router.post("/",           createOrder);
router.get("/my",          getMyOrders);
router.get("/",            getAllOrders);
router.get("/:id",         getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id",      deleteOrder);

module.exports = router;
