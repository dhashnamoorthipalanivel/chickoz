const Table = require("../../models/masterModels/tableModel");

// CREATE
exports.createTable = async (req, res) => {
  try {
    const { tableName, seatingCapacity, franchiseId, status } = req.body;
    
    // Check if table name already exists
    let query = { tableName, isDeleted: false };
    if (franchiseId) query.franchiseId = franchiseId;

    const existingTable = await Table.findOne(query);
    if (existingTable) {
      return res.status(400).json({ message: "Table already exists" });
    }

    const newTable = new Table({
      tableName,
      seatingCapacity,
      franchiseId,
      status,
    });
    
    await newTable.save();
    res.status(201).json({ message: "Table created successfully", table: newTable });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ ALL
exports.getAllTables = async (req, res) => {
  try {
    const { franchiseId } = req.query;
    let query = { isDeleted: false };
    
    if (franchiseId) {
      query.franchiseId = franchiseId;
    }

    const tables = await Table.find(query).sort({ createdAt: -1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ ONE
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.id, isDeleted: false });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE
exports.updateTable = async (req, res) => {
  try {
    const { tableName, seatingCapacity, franchiseId, status } = req.body;

    const table = await Table.findOne({ _id: req.params.id, isDeleted: false });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Check duplicate
    let query = { tableName, _id: { $ne: req.params.id }, isDeleted: false };
    if (franchiseId) query.franchiseId = franchiseId;

    const existingTable = await Table.findOne(query);
    if (existingTable) {
      return res.status(400).json({ message: "Table already exists" });
    }

    table.tableName = tableName || table.tableName;
    if (seatingCapacity !== undefined) table.seatingCapacity = seatingCapacity;
    if (franchiseId) table.franchiseId = franchiseId;
    if (status) table.status = status;

    await table.save();
    res.status(200).json({ message: "Table updated successfully", table });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE (Soft delete)
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    table.isDeleted = true;
    table.deletedAt = new Date();
    await table.save();

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
