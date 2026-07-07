const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    taxName: {
      type: String,
      required: true,
      trim: true,
    },

    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    taxType: {
      type: String,
      required: true,
      enum: ["GST", "VAT", "SERVICE_TAX"],
      uppercase: true,
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
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tax", taxSchema);