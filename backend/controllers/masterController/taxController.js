const Tax = require("../../models/masterModels/TaxModel");

// CREATE
exports.createTax = async (req, res) => {
  try {
    const data = await Tax.create(req.body);
    res.status(201).json(data);
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (hide deleted)
exports.getTaxes = async (req, res) => {
  try {
    const data = await Tax.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE
exports.getTaxById = async (req, res) => {
  try {
    const data = await Tax.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateTax = async (req, res) => {
  try {
    const data = await Tax.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOFT DELETE
exports.deleteTax = async (req, res) => {
  try {
    await Tax.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.json({ message: "Tax Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
