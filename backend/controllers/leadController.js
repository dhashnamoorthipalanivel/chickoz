const Lead = require("../models/leadModel");
const Enquiry = require("../models/enquiryModel");
const {
  createKishokFromLead,
  removeKishokFromLead,
} = require("./kishokController");
const Kishok = require("../models/kishokModel");
const Franchise = require("../models/masterModels/franchiseModel");

// ===================================================
// ✅ GET ALL LEADS
// ===================================================

exports.getLeads = async (req, res) => {
  try {
    const data = await Lead.find({
      isDeleted: false,
    })
      .populate({ path: "interestedPackage", populate: { path: "packageMaterials" } })
      .populate("leadSource", "leadSourceName")
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===================================================
// ✅ GET SINGLE LEAD
// ===================================================

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate({ path: "interestedPackage", populate: { path: "packageMaterials" } })
      .populate("leadSource", "leadSourceName");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===================================================
// ✅ UPDATE LEAD
// ===================================================

exports.updateLead = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    const lead = await Lead.findById(req.params.id).populate(
      "interestedPackage",
    );

    const trainingData = lead?.stages?.TRAINING?.data || {};

    if (trainingData.cartRequired === "yes") {
      await createKishokFromLead(lead);
    } else {
      await removeKishokFromLead(lead.referenceId);
    }

    await Kishok.findOneAndUpdate(
      { referenceId: lead.referenceId },

      { leadStatus: lead.leadStatus },
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // 🔥 SYNC BASIC INFO TO ENQUIRY
    await Enquiry.findOneAndUpdate(
      {
        referenceId: lead.referenceId,
      },
      {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        place: lead.place,
        state: lead.state,
        address: lead.address,
        assignedTo: lead.assignedTo,

        interestedPackage: lead.interestedPackage,

        leadSource: lead.leadSource,
      },
    );

    // Franchise auto created

    res.status(200).json({
      message: "Lead updated successfully",

      lead,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createFranchise = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "interestedPackage",
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.isFranchiseCreated) {
      return res.status(400).json({
        message: "Franchise already created",
      });
    }

    const franchises = await Franchise.find({}, "franchiseId");

    let maxNumber = 0;

    franchises.forEach((f) => {
      const num = parseInt(f.franchiseId.replace("FR", ""));

      if (num > maxNumber) {
        maxNumber = num;
      }
    });

    const franchiseId = `FR${String(maxNumber + 1).padStart(3, "0")}`;

    const newFranchise = await Franchise.create({
      franchiseId,

      referenceId: lead.referenceId,

      franchiseName: "",

      ownerName: lead.name,

      manager: "",

      contact: lead.phone,

      email: lead.email,

      packageName: lead?.interestedPackage?.packageName || "",

      status: "ACTIVE",

      address: lead.address,

      location: lead.place,

      state: lead.state || "",

      country: "India",

      postCode: lead.postCode,

      password: "Chickoz@123",

      inviteStatus: "ACTIVE",

      passwordSetupAt: new Date(),
    });

    const User = require("../models/user");
    await User.create({
      firstName: lead.name,
      email: lead.email,
      phone: lead.phone,
      password: "Chickoz@123",
      role: "franchise",
      franchiseId: newFranchise._id,
      isActive: true,
      isEmailVerified: true
    });

    lead.isFranchiseCreated = true;

    await lead.save();

    await Kishok.findOneAndUpdate(
      {
        referenceId: lead.referenceId,
      },

      {
        isFranchiseCreated: true,
      },
    );

    res.status(200).json({
      message: "Franchise created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};
