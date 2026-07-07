const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
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
    cartSize: {
      type: String,
      trim: true,
      default: "",
    },

    cartAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    packageType: {
      type: String,
      enum: ["GAS", "ELECTRICAL", "BOTH"],
      required: true,
      default: "GAS",
    },

    photos: {
      type: [String],
      default: [],
    },

    kitchenEquipmentIncluded: {
      type: Boolean,
      default: false,
    },

    packageMaterials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
    ],

    packageMenuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

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
      enum: ["PERCENTAGE", "FIXED", "NO_ROYALTY"],
      required: true,
    },

    royaltyValue: {
      type: Number,
      default: 0,
    },

    isTaxApplicable: {
      type: Boolean,
      default: true,
    },

    taxPercentage: {
      type: Number,
      default: 18,
    },

    isTaxInclusive: {
      type: Boolean,
      default: false,
    },

    sacCode: {
      type: String,
      trim: true,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
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
