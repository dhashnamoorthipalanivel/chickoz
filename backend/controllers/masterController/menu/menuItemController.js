const Menu = require("../../../models/masterModels/menu/menuItemModel");

// CREATE
exports.createMenu = async (req, res) => {
  try {
    const data = await Menu.create(req.body);

    res.status(201).json(data);
  } catch (error) {
    console.log("CREATE MENU ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL (hide deleted)
exports.getMenus = async (req, res) => {
  try {
    const data = await Menu.find({
      isDeleted: false,
    })
      .populate("comboItems.menuId", "menuName price")
      .populate("taxId", "taxName taxPercentage")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json(data);
  } catch (error) {
    console.log("GET MENUS ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE
exports.getMenuById = async (req, res) => {
  try {
    const data = await Menu.findById(req.params.id).populate(
      "comboItems.menuId",
      "menuName price",
    );

    if (!data) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.log("GET MENU ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ONLY NON-COMBO MENUS (for combo builder)
exports.getNonComboMenus = async (req, res) => {
  try {
    const data = await Menu.find({
      isDeleted: false,
      status: "ACTIVE",
      isCombo: false,
    })
      .select("_id menuName price category")
      .sort({ menuName: 1 });

    res.json(data);
  } catch (error) {
    console.log("GET NON COMBO ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE
exports.updateMenu = async (req, res) => {
  try {
    const payload = { ...req.body };

    // if normal item remove comboItems
    if (!payload.isCombo) {
      payload.comboItems = [];
    }

    const data = await Menu.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate("comboItems.menuId", "menuName price")
      .populate("taxId", "taxName taxPercentage")

    if (!data) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.log("UPDATE MENU ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// SOFT DELETE
exports.deleteMenu = async (req, res) => {
  try {
    const data = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!data) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.log("DELETE MENU ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
