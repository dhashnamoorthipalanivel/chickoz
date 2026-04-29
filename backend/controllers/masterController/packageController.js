const Package = require('../../models/masterModels/packageModel');

// CREATE
exports.createPackage = async (req, res) => {
  try {
    const data = await Package.create(req.body);
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
    const data = await Package.findByIdAndUpdate(
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