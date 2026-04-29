const MasalaItem = require('../../models/masterModels/masalaItemsModel');

// CREATE
exports.createMasalaItem = async (req, res) => {
  try {
    const data = await MasalaItem.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};


// GET ALL (hide deleted)
exports.getMasalaItems = async (req, res) => {
  try {
    const data = await MasalaItem.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
exports.getMasalaItemById = async (req, res) => {
  try {
    const data = await MasalaItem.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updateMasalaItem = async (req, res) => {
  try {
    const data = await MasalaItem.findByIdAndUpdate(
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
exports.deleteMasalaItem = async (req, res) => {
  try {
    await MasalaItem.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: "MasalaItem Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};