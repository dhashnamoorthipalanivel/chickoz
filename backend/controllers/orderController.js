const Order = require("../models/orderModel");

exports.createOrder = async (req, res) => {
  try {
    const franchiseId = req.user?.franchiseId;
    if (!franchiseId) return res.status(400).json({ message: "No franchise linked to this user" });

    const order = new Order({ ...req.body, franchiseId, createdBy: req.user._id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const franchiseId = req.user?.franchiseId;
    if (!franchiseId) return res.status(400).json({ message: "No franchise linked to this user" });

    const orders = await Order.find({ franchiseId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("franchiseId", "franchiseName franchiseCode")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("franchiseId", "franchiseName franchiseCode");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const update = {};
    if (req.body.orderStatus)   update.orderStatus   = req.body.orderStatus;
    if (req.body.paymentStatus) update.paymentStatus = req.body.paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
