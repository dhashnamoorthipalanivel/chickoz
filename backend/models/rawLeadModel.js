const mongoose = require("mongoose");

const rawLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    platform: {
      type: String,
      enum: ["FACEBOOK", "GOOGLE", "INSTAGRAM", "WEBSITE", "OTHER"],
      default: "OTHER",
    },
    campaignName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "CONVERTED"],
      default: "PENDING",
    },
    rawData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    convertedToEnquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawLead", rawLeadSchema);
