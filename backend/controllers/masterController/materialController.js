const Material = require("../../models/masterModels/materialModel");

exports.createMaterial = async (req, res) => {
  try {
    const data = await Material.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const data = await Material.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const data = await Material.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const data = await Material.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    res.json({ message: "Material Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
