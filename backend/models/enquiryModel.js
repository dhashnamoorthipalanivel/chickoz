const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    // 🔢 Auto Generated ID (ENQ001)
    referenceId: {
      type: String,
      unique: true,
    },

    // 👤 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    place: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    // 📦 Master Reference → Package
    interestedPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    // 📢 Master Reference → Lead Source
    leadSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSource",
      required: true,
    },

    // 📊 Status
    status: {
      type: String,
      enum: ["NEW", "FOLLOW_UP", "HOLD", "CANCELLED", "CONVERTED_TO_LEAD"],
      default: "NEW",
    },

    // 📅 Follow-up
    followUpDate: {
      type: Date,
    },

    remarks: {
      type: String,
    },

    // 👤 Assigned User (future → ObjectId)
    assignedTo: {
      type: String,
      required: true,
    },

    // 🔁 Conversion Tracking
    isConverted: {
      type: Boolean,
      default: false,
    },

    convertedAt: {
      type: Date,
    },

    // 🔗 Link to Lead
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Enquiry", enquirySchema);
