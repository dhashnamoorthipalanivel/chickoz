const Package = require('../../models/masterModels/packageModel');

const calculateAmount = (data) => {

  let price =
    Number(data.price) || 0;

  let cartAmount =
    Number(data.cartAmount) || 0;

  let gst =
    Number(data.taxPercentage) || 0;

  // ✅ PACKAGE + CART
  let baseAmount =
    price + cartAmount;

  // ✅ NO GST
  if (!data.isTaxApplicable) {

    return {
      taxAmount: 0,
      totalAmount: Math.round(baseAmount)
    };
  }

  let taxAmount = 0;
  let totalAmount = 0;

  // ✅ GST EXCLUSIVE
  if (!data.isTaxInclusive) {

    taxAmount =
      (baseAmount * gst) / 100;

    totalAmount =
      baseAmount + taxAmount;

  }

  // ✅ GST INCLUSIVE
  else {

    taxAmount =
      (baseAmount * gst) /
      (100 + gst);

    totalAmount = baseAmount;
  }

  return {

    taxAmount:
      Math.round(taxAmount),

    totalAmount:
      Math.round(totalAmount)
  };
};

// CREATE
exports.createPackage = async (req, res) => {
  try {
    const { taxAmount, totalAmount } = calculateAmount(req.body);

    const payload = {
      ...req.body,
      taxAmount,
      totalAmount
    };

    const data = await Package.create(payload);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL (hide deleted)
exports.getPackages = async (req, res) => {
  try {
    const data = await Package.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
exports.getPackageById = async (req, res) => {
  try {
    const data = await Package.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updatePackage = async (req, res) => {
  try {
    const { taxAmount, totalAmount } = calculateAmount(req.body);

    const payload = {
      ...req.body,
      taxAmount,
      totalAmount
    };

    const data = await Package.findByIdAndUpdate(
      req.params.id,
      payload,
      { returnDocument: "after" }
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SOFT DELETE
exports.deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: "Package Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};