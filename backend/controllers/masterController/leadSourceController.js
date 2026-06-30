const LeadSource = require('../../models/masterModels/leadSourceModel');

// CREATE
exports.createLeadSource = async (req, res) => {
  try {
    const data = await LeadSource.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL (hide deleted)
exports.getLeadSources = async (req, res) => {
  try {
    const data = await LeadSource.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
exports.getLeadSourceById = async (req, res) => {
  try {
    const data = await LeadSource.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updateLeadSource = async (req, res) => {
  try {
    const data = await LeadSource.findByIdAndUpdate(
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
exports.deleteLeadSource = async (req, res) => {
  try {
    await LeadSource.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: "LeadSource Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};