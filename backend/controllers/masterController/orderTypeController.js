const OrderType = require('../../models/masterModels/orderTypeModel');

// CREATE
exports.createOrderType = async (req, res) => {
  try {
    const data = await OrderType.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL (hide deleted)
exports.getOrderTypes = async (req, res) => {
  try {
    const data = await OrderType.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
exports.getOrderTypeById = async (req, res) => {
  try {
    const data = await OrderType.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updateOrderType = async (req, res) => {
  try {
    const data = await OrderType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SOFT DELETE
exports.deleteOrderType = async (req, res) => {
  try {
    await OrderType.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: "OrderType Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};