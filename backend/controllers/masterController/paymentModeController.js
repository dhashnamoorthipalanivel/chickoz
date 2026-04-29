const PaymentMode = require('../../models/masterModels/paymentModeModel');

// CREATE
exports.createPaymentMode = async (req, res) => {
  try {
    const data = await PaymentMode.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL (hide deleted)
exports.getPaymentModes = async (req, res) => {
  try {
    const data = await PaymentMode.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
exports.getPaymentModeById = async (req, res) => {
  try {
    const data = await PaymentMode.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updatePaymentMode = async (req, res) => {
  try {
    const data = await PaymentMode.findByIdAndUpdate(
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
exports.deletePaymentMode = async (req, res) => {
  try {
    await PaymentMode.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: "PaymentMode Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};