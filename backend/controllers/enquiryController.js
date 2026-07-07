const Enquiry = require("../models/enquiryModel");
const Lead = require("../models/leadModel");
const FollowupHistory = require("../models/followupHistoryModel");

const generateReferenceId = async () => {
  const enquiries = await Enquiry.find({}).select("referenceId");

  let maxNumber = 0;

  enquiries.forEach((item) => {
    if (!item.referenceId) return;

    const num = parseInt(item.referenceId.replace("REF", ""), 10);

    if (!isNaN(num) && num > maxNumber) {
      maxNumber = num;
    }
  });

  const nextNumber = maxNumber + 1;

  return `REF${String(nextNumber).padStart(3, "0")}`;
};

// ✅ CREATE ENQUIRY
exports.createEnquiry = async (req, res) => {
  try {
    const referenceId = await generateReferenceId();

    const enquiry = await Enquiry.create({
      ...req.body,
      followUpDate: req.body.followUpDate
        ? new Date(req.body.followUpDate)
        : null,
      referenceId,
    });

    res.status(201).json(enquiry);
  } catch (error) {
    console.error("CREATE ERROR:", error);

    // 🔥 HANDLE DUPLICATE
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate Enquiry ID. Try again.",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL (Search + Filter)
exports.getEnquiries = async (req, res) => {
  try {
    const { search, status, leadSource } = req.query;

    let query = {
      isDeleted: false,

      status: {
        $ne: "CONVERTED_TO_LEAD",
      },
    };

    // 🔍 Search
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { referenceId: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { place: new RegExp(search, "i") },
        { assignedTo: new RegExp(search, "i") },
      ];
    }

    // 📊 Status filter
    if (status && status !== "ALL") {
      query.status = status;
    }

    // 📢 Lead Source filter
    if (leadSource && leadSource !== "ALL") {
      query.leadSource = leadSource;
    }

    const data = await Enquiry.find(query)
      .populate("leadSource", "leadSourceName")
      .populate("interestedPackage", "packageName")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ONE
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({
      _id: req.params.id,
      isDeleted: false, // 🔥 important
    })
      .populate("interestedPackage", "packageName")
      .populate("leadSource", "leadSourceName");

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, // 🔥 important
      req.body,
      { new: true },
    );

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE
exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 CONVERT TO LEAD (VERY IMPORTANT)
exports.convertToLead = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    // ❌ NOT FOUND
    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    // ❌ ALREADY CONVERTED
    if (enquiry.isConverted) {
      return res.status(400).json({
        message: "Already converted to lead",
      });
    }

    // 🔥 CREATE LEAD
    const lead = await Lead.create({
      referenceId: enquiry.referenceId,

      name: enquiry.name,

      phone: enquiry.phone,

      email: enquiry.email,

      place: enquiry.place,

      postCode: enquiry.postCode,

      address: enquiry.address,

      interestedPackage: enquiry.interestedPackage,

      leadSource: enquiry.leadSource,

      assignedTo: enquiry.assignedTo,
    });

    // 🔥 UPDATE ENQUIRY
    enquiry.status = "CONVERTED_TO_LEAD";

    enquiry.isConverted = true;

    enquiry.convertedAt = new Date();

    enquiry.leadId = lead._id;

    await enquiry.save();

    res.status(200).json({
      success: true,

      message: "Converted to lead successfully",

      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ ADD FOLLOWUP HISTORY ENTRY
exports.addFollowup = async (req, res) => {
  try {
    const { followUpDate, remarks, status, addedBy } = req.body;

    const enquiry = await Enquiry.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const entry = await FollowupHistory.create({
      enquiryId: req.params.id,
      followUpDate: new Date(followUpDate),
      remarks: remarks || "",
      status: status || enquiry.status,
      addedBy: addedBy || "Admin",
    });

    // Sync enquiry's latest followup fields
    await Enquiry.findByIdAndUpdate(req.params.id, {
      followUpDate: new Date(followUpDate),
      remarks: remarks || enquiry.remarks,
      ...(status && { status }),
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET FOLLOWUP HISTORY
exports.getFollowupHistory = async (req, res) => {
  try {
    const history = await FollowupHistory.find({
      enquiryId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNextReferenceId = async (req, res) => {
  try {
    const nextId = await generateReferenceId();

    res.json({
      referenceId: nextId,
    });
  } catch (err) {
    console.error("NEXT ID ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
