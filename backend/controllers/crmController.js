const Lead = require("../models/leadModel");

// Get pipeline data
exports.getPipeline = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).populate("interestedPackage").populate("leadSource");
    
    // Group leads by pipelineStage
    const pipeline = {
      LEAD: [],
      CONTACTED: [],
      PROPOSAL: [],
      NEGOTIATION: [],
      WON: [],
      LOST: []
    };
    
    leads.forEach(lead => {
      const stage = lead.pipelineStage || "LEAD";
      if (pipeline[stage]) {
        pipeline[stage].push(lead);
      } else {
        // Fallback for unexpected stages
        pipeline.LEAD.push(lead);
      }
    });
    
    res.status(200).json(pipeline);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching pipeline" });
  }
};

// Move lead stage
exports.moveLead = async (req, res) => {
  try {
    const { leadId, newStage } = req.body;
    const lead = await Lead.findByIdAndUpdate(leadId, { pipelineStage: newStage }, { new: true });
    res.status(200).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error moving lead" });
  }
};

// Get activities (dummy implementation for now)
exports.getActivities = async (req, res) => {
  res.status(200).json({ activities: [] });
};

// Add activity (dummy implementation for now)
exports.addActivity = async (req, res) => {
  const newActivity = {
    _id: Math.random().toString(),
    activityType: req.body.activityType || "NOTE",
    notes: req.body.notes || "",
    createdAt: new Date()
  };
  res.status(201).json(newActivity);
};

const RawLead = require("../models/rawLeadModel");
const Enquiry = require("../models/enquiryModel");

// Get Macro Pipeline Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalSocialLeads = await RawLead.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    const enquiriesConverted = await Enquiry.countDocuments({ isConverted: true });
    const franchisesCreated = await Lead.countDocuments({ isFranchiseCreated: true });

    // Aggregate social leads by platform
    const platformAggregation = await RawLead.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } }
    ]);
    const socialLeadsByPlatform = { FACEBOOK: 0, INSTAGRAM: 0, GOOGLE: 0, OTHER: 0 };
    platformAggregation.forEach(item => {
      if (item._id === "FACEBOOK") socialLeadsByPlatform.FACEBOOK = item.count;
      else if (item._id === "INSTAGRAM") socialLeadsByPlatform.INSTAGRAM = item.count;
      else if (item._id === "GOOGLE") socialLeadsByPlatform.GOOGLE = item.count;
      else socialLeadsByPlatform.OTHER += item.count;
    });

    res.status(200).json({
      socialLeads: totalSocialLeads,
      enquiries: totalEnquiries,
      convertedToLead: enquiriesConverted,
      convertedToFranchise: franchisesCreated,
      socialLeadsByPlatform
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};

exports.socialMediaWebhook = async (req, res) => {
  // dummy webhook
  res.status(200).json({ success: true });
};
