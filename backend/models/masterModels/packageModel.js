const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: String,
      default: "",
    },

    agreementDuration: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    advanceAmount: {
      type: Number,
      required: true,
    },

    royaltyType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },

    royaltyPercentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,

    remarks: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Package", packageSchema);
