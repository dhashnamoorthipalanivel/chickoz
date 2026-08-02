const Franchise = require("../../models/masterModels/franchiseModel");
const Menu = require("../../models/masterModels/menu/menuItemModel");

exports.updateAssignedMenus = async (req, res) => {
  try {
    const { assignedMenus } = req.body;

    // ✅ VALIDATION
    if (!Array.isArray(assignedMenus)) {
      return res.status(400).json({
        message: "assignedMenus must be an array",
      });
    }

    const franchise = await Franchise.findById(req.params.id);

    if (!franchise) {
      return res.status(404).json({
        message: "Franchise not found",
      });
    }

    // ✅ UPDATE
    franchise.assignedMenus = assignedMenus;

    await franchise.save();

    res.status(200).json({
      message: "Menus assigned successfully",

      assignedMenus: franchise.assignedMenus,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMyMenus = async (req, res) => {

  try {

    // ✅ LOGGED USER
    const user = req.user;

    // ✅ FIND FRANCHISE
    const franchise =
      await Franchise.findById(
        user.franchiseId
      );

    if (!franchise) {

      return res.status(404).json({
        message: "Franchise not found",
      });
    }

    // ✅ ONLY ASSIGNED IDS
    const assignedMenuIds =
      franchise.assignedMenus
        .filter(
          (item) =>
            item.isAssigned === true
        )
        .map(
          (item) => item.menuId
        );

    // ✅ FETCH FULL MENUS
    const menus =
      await Menu.find({

        _id: {
          $in: assignedMenuIds
        },

        isDeleted: false,

        status: "ACTIVE",

      })

        .populate(
          "comboItems.menuId",
          "menuName menuCode price"
        )

        .populate(
          "taxId",
          "taxName taxPercentage"
        )

        .sort({
          sortOrder: 1,
          createdAt: -1,
        });

    // ✅ MERGE VISIBILITY
    const formattedMenus =
      menus.map((menu) => {

        const assignedData =
          franchise.assignedMenus.find(
            (item) =>
              item.menuId.toString() ===
              menu._id.toString()
          );

        return {

          menuId:
            menu._id,

          menuCode:
            menu.menuCode,

          menuName:
            menu.menuName,

          category:
            menu.category,

          foodType:
            menu.foodType,

          image:
            menu.image,

          description:
            menu.description,

          price:
            menu.price,

          // OFFER
          hasOffer:
            menu.hasOffer,

          offerType:
            menu.offerType,

          offerValue:
            menu.offerValue,

          offerStartDate:
            menu.offerStartDate,

          offerEndDate:
            menu.offerEndDate,

          // TAX
          isTaxApplicable:
            menu.isTaxApplicable,

          taxId:
            menu.taxId,

          // COMBO
          isCombo:
            menu.isCombo,

          comboItems:
            menu.comboItems || [],

          // ADDONS
          addons:
            menu.addons || [],

          // CUSTOMIZATION
          customizationOptions:
            menu.customizationOptions || [],

          // BILLING
          isAssigned: true,

          isVisibleInBilling:
            assignedData?.isVisibleInBilling ?? true,

          salePrice:
            assignedData?.salePrice ?? null,
        };
      });

    res.status(200).json({

      success: true,

      menus: formattedMenus,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Franchise menu visibility
exports.updateMenuVisibility = async (req, res) => {
  try {
    const {
      menuId,
      isVisibleInBilling,
      salePrice,
      franchiseId: reqFranchiseId,
    } = req.body;

    // ✅ LOGGED USER
    const user = req.user;

    // ✅ FIND FRANCHISE
    const targetFranchiseId = reqFranchiseId || user.franchiseId;
    const franchise = await Franchise.findById(targetFranchiseId);

    if (!franchise) {
      return res.status(404).json({
        message: "Franchise not found",
      });
    }

    // ✅ FIND MENU
    const menu = franchise.assignedMenus.find(
      (item) => item.menuId.toString() === menuId,
    );

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    // ✅ UPDATE DATA
    if (isVisibleInBilling !== undefined) {
      menu.isVisibleInBilling = isVisibleInBilling;
    }
    if (salePrice !== undefined) {
      menu.salePrice = salePrice;
    }

    await franchise.save();

    res.status(200).json({
      success: true,

      message: "Menu data updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
