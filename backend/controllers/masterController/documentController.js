const Document = require('../../models/masterModels/DocumentModel');

// CREATE
exports.createDocument = async (req, res) => {
  try {
    const data = await Document.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL (hide deleted)
exports.getDocuments = async (req, res) => {
  try {
    const data = await Document.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
exports.getDocumentById = async (req, res) => {
  try {
    const data = await Document.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updateDocument = async (req, res) => {
  try {
    const data = await Document.findByIdAndUpdate(
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
exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: "Document Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};