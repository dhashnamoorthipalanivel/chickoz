const Lead = require("../models/leadModel");
const Enquiry = require("../models/enquiryModel");
const { createKishokFromLead, removeKishokFromLead } = require("./kishokController");

// ===================================================
// ✅ GET ALL LEADS
// ===================================================

exports.getLeads = async (req, res) => {
  try {
    const data = await Lead.find({
      isDeleted: false,
    })
      .populate("interestedPackage")
      .populate("leadSource", "leadSourceName")
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (error) {
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
      .populate("interestedPackage")
      .populate("leadSource", "leadSourceName");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json(lead);
  } catch (error) {
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
        address: lead.address,
        assignedTo: lead.assignedTo,

        interestedPackage: lead.interestedPackage,

        leadSource: lead.leadSource,
      },
    );

    res.status(200).json({
      message: "Lead updated successfully",

      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
