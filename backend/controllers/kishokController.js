const Kishok = require("../models/kishokModel");
const Lead = require("../models/leadModel");

// ===================================================
// ✅ GET ALL
// ===================================================

exports.getKishoks = async (req, res) => {
  try {
    const data = await Kishok.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===================================================
// ✅ GET SINGLE
// ===================================================

exports.getKishokById = async (req, res) => {
  try {
    const data = await Kishok.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Kishok not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===================================================
// ✅ AUTO CREATE FROM LEAD
// ===================================================

exports.createKishokFromLead = async (lead) => {
  try {
    const trainingData = lead?.stages?.TRAINING?.data || {};

    // ✅ ONLY CART YES
    if (trainingData.cartRequired !== "yes") {
      return;
    }

    // ✅ AVOID DUPLICATE
    const alreadyExists = await Kishok.findOne({
      referenceId: lead.referenceId,
    });

    // ✅ IF SOFT DELETED
    if (alreadyExists && alreadyExists.isDeleted) {
      alreadyExists.isDeleted = false;

      alreadyExists.deletedAt = null;

      alreadyExists.customerName = lead.name;
      alreadyExists.leadStatus = lead.leadStatus;

      alreadyExists.phone = lead.phone;

      alreadyExists.place = lead.place;

      alreadyExists.packageName = lead?.interestedPackage?.packageName || "";

      alreadyExists.cartSize = trainingData.cartSize;

      alreadyExists.cartAmount = trainingData.cartAmount;

      alreadyExists.brandingType = trainingData.brandingType;

      alreadyExists.accessories = trainingData.accessories;

      alreadyExists.requiredDate = trainingData.cartRequiredDate;

      alreadyExists.priority = trainingData.cartPriority;

      alreadyExists.manufactureStatus = "PENDING";

      alreadyExists.pendingAmount = trainingData.cartAmount || 0;

      await alreadyExists.save();

      return;
    }

    // ✅ NORMAL EXIST
    if (alreadyExists && !alreadyExists.isDeleted) {

  alreadyExists.customerName = lead.name;

  alreadyExists.phone = lead.phone;

  alreadyExists.place = lead.place;

  alreadyExists.packageName =
    lead?.interestedPackage?.packageName || "";

  alreadyExists.cartSize =
    trainingData.cartSize;

  alreadyExists.cartAmount =
    trainingData.cartAmount;

  alreadyExists.brandingType =
    trainingData.brandingType;

  alreadyExists.accessories =
    trainingData.accessories;

  // ✅ IMPORTANT
  alreadyExists.requiredDate =
    trainingData.cartRequiredDate;

  alreadyExists.priority =
    trainingData.cartPriority;

  await alreadyExists.save();

  return;
}

    await Kishok.create({
      referenceId: lead.referenceId,
      leadStatus:lead.leadStatus,
      customerName: lead.name,
      phone: lead.phone,
      place: lead.place,
      packageName: lead?.interestedPackage?.packageName || "",
      cartSize: trainingData.cartSize,
      cartAmount: Number( trainingData.cartAmount || lead.interestedPackage?.cartAmount || 0, ),
      brandingType: trainingData.brandingType,
      accessories: trainingData.accessories,
      requiredDate: trainingData.cartRequiredDate,
      priority: trainingData.cartPriority || "Normal",
      manufactureStatus: "PENDING",
      pendingAmount: trainingData.cartAmount || 0,
    });

    // ✅ UPDATE LEAD STATUS
    await Lead.findByIdAndUpdate(lead._id, {
      "stages.TRAINING.data.cartManufactureStatus": "PENDING",
    });
  } catch (error) {
    console.log(error);
  }
};

// ===================================================
// ✅ UPDATE
// ===================================================

exports.updateKishok = async (req, res) => {
  try {
    let updateBody = { ...req.body };

    // Handle files uploaded via Multer if present
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(f => `/uploads/${f.filename}`);
      const uploadedNames = req.files.map(f => f.originalname);

      let existingImgs = [];
      let existingNames = [];
      if (req.body.cartImages) {
        try {
          existingImgs = typeof req.body.cartImages === "string" ? JSON.parse(req.body.cartImages) : req.body.cartImages;
        } catch (_) { existingImgs = [req.body.cartImages]; }
      }
      if (req.body.cartImageNames) {
        try {
          existingNames = typeof req.body.cartImageNames === "string" ? JSON.parse(req.body.cartImageNames) : req.body.cartImageNames;
        } catch (_) { existingNames = [req.body.cartImageNames]; }
      }

      const allImgs = [...existingImgs, ...uploadedUrls];
      const allNames = [...existingNames, ...uploadedNames];

      updateBody.cartImages = allImgs;
      updateBody.cartImageNames = allNames;
      updateBody.cartImage = allImgs[0] || "";
      updateBody.cartImageName = allNames[0] || "";
    } else if (updateBody.cartImages) {
      if (!Array.isArray(updateBody.cartImages)) {
        try { updateBody.cartImages = JSON.parse(updateBody.cartImages); } catch (_) { updateBody.cartImages = [updateBody.cartImages]; }
      }
      if (updateBody.cartImageNames && !Array.isArray(updateBody.cartImageNames)) {
        try { updateBody.cartImageNames = JSON.parse(updateBody.cartImageNames); } catch (_) { updateBody.cartImageNames = [updateBody.cartImageNames]; }
      }
      updateBody.cartImage = updateBody.cartImages[0] || "";
      updateBody.cartImageName = (updateBody.cartImageNames && updateBody.cartImageNames[0]) || "";
    }

    const data = await Kishok.findByIdAndUpdate(req.params.id, updateBody, {
      returnDocument: "after",
    });

    if (!data) {
      return res.status(404).json({
        message: "Kishok not found",
      });
    }

    // ✅ PAYMENT SUMMARY
    const paidAmount = (data.payments || []).reduce(
      (a, b) => a + Number(b.amount || 0),
      0,
    );

    const pendingAmount = Math.max(
      Number(data.cartAmount || 0) - paidAmount,
      0,
    );

    // ✅ SAVE PAYMENT SUMMARY
    data.paidAmount = paidAmount;
    data.pendingAmount = pendingAmount;

    await data.save();

    // ✅ SYNC TO LEAD
    const lead = await Lead.findOne({
      referenceId: data.referenceId,
    });

    if (
      lead &&
      lead.stages &&
      lead.stages.TRAINING &&
      lead.stages.TRAINING.data
    ) {
      lead.stages.TRAINING.data.cartManufactureStatus = data.manufactureStatus;
      lead.stages.TRAINING.data.cartAssignedVendor = data.vendorName;
      await lead.save();
    }

    res.status(200).json({
      message: "Kishok updated successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.removeKishokFromLead = async (referenceId) => {
  try {
    await Kishok.findOneAndUpdate(
      { referenceId },

      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
