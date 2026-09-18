const Franchise = require("../models/masterModels/franchiseModel");
const Lead = require("../models/leadModel");
const Kishok = require("../models/kishokModel");

const KNOWN_CITY_COORDS = {
  chithode: [11.4116, 77.6749],
  bhavani: [11.4485, 77.6835],
  gobi: [11.4542, 77.4411],
  gobichettipalayam: [11.4542, 77.4411],
  sathya: [11.5034, 77.2444],
  sathyamangalam: [11.5034, 77.2444],
  erode: [11.3410, 77.7172],
  komarapalayam: [11.4428, 77.7126],
  salem: [11.6643, 78.1460],
  chennai: [13.0827, 80.2707],
};

exports.getFranchiseProfile = async (req, res) => {
  try {
    let franchiseId = req.params.id;

    // If "my-profile" is the route, or no ID is passed, use the authenticated user's franchiseId
    if (!franchiseId || franchiseId === "my-profile") {
      franchiseId = req.user.franchiseId;
    }

    if (!franchiseId) {
      return res.status(400).json({ message: "Franchise ID is required" });
    }

    const franchise = await Franchise.findById(franchiseId).lean();
    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    const lead = await Lead.findOne({ referenceId: franchise.referenceId }).populate("interestedPackage").lean();
    const kishok = await Kishok.findOne({ referenceId: franchise.referenceId }).lean();

    // Recover coordinates if missing on Franchise but exist on Lead
    let lat = franchise.latitude;
    let lng = franchise.longitude;

    if (!lat || !lng) {
      const finalSetup = lead?.stages?.FINAL_SETUP?.data || {};
      const siteVisit = lead?.stages?.SITE_VISIT?.data || {};
      lat = finalSetup.lat || siteVisit.lat || null;
      lng = finalSetup.lng || siteVisit.lng || null;
    }
    
    // Fallback to known city coords
    if (!lat || !lng) {
      const nameText = (franchise.franchiseName || '').toLowerCase();
      const addrText = (franchise.address || '').toLowerCase();
      const locText = (franchise.location || '').toLowerCase();
      
      for (const [key, coords] of Object.entries(KNOWN_CITY_COORDS)) {
        if (nameText.includes(key) || addrText.includes(key) || locText.includes(key)) {
          lat = coords[0];
          lng = coords[1];
          break;
        }
      }
    }

    // Compile profile data
    const profile = {
      _id: franchise._id,
      referenceId: franchise.referenceId,
      franchiseId: franchise.franchiseId,
      franchiseName: franchise.franchiseName,
      ownerName: franchise.ownerName,
      manager: franchise.manager,
      contact: franchise.contact,
      email: franchise.email,
      packageName: franchise.packageName || lead?.interestedPackage?.packageName || "",
      address: franchise.address,
      location: franchise.location,
      latitude: lat,
      longitude: lng,
      status: franchise.status,
      
      // Documents from Lead's Approval stage
      documents: lead?.stages?.APPROVAL?.data?.documents || [],
      
      // Cart Images from Kishok
      cartImages: kishok?.cartImages || [],
      
      // Accessories (Check Kishok first, fallback to Lead's Training stage)
      accessories: kishok?.accessories || lead?.stages?.TRAINING?.data?.accessories || ""
    };

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
