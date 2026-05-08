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
    console.log(error)
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
      return;
    }

    await Kishok.create({
      referenceId: lead.referenceId,

      customerName: lead.name,

      phone: lead.phone,

      place: lead.place,

      packageName: lead?.interestedPackage?.packageName || "",

      cartSize: trainingData.cartSize,

      cartAmount:  Number( trainingData.cartAmount ||lead.interestedPackage?.cartAmount ||0),

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
    const data = await Kishok.findByIdAndUpdate(req.params.id, req.body, {
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

    if ( lead && lead.stages &&lead.stages.TRAINING && lead.stages.TRAINING.data) {

  lead.stages
    .TRAINING
    .data
    .cartManufactureStatus =
      data.manufactureStatus;

  lead.stages
    .TRAINING
    .data
    .cartAssignedVendor =
      data.vendorName;

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

exports.removeKishokFromLead =
  async (referenceId) => {

    try {

      await Kishok.findOneAndUpdate(
        { referenceId },

        {
          isDeleted: true,
          deletedAt: new Date(),
        }
      );

    } catch (error) {
      console.log(error);
      res.status(500).json({
    message: error.message,
  });
    }
  };