const mongoose = require("mongoose");

const masalaItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Masala", "Mix Powder", "Coating", "Seasoning", "Sauce"],
    },

    vegType: {
      type: String,
      required: true,
      enum: ["VEG", "NON_VEG"],
      default: "VEG",
    },

    packSize: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      required: true,
      enum: ["KG", "GRAM", "PACKET", "BOTTLE", "BOX"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isTaxApplicable: {
      type: Boolean,
      default: true,
    },

    taxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      default: null,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Details ──────────────────────────────────────
    mfd: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    batchNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    ingredients: {
      type: String,
      required: true,
      trim: true,
    },

    allergens: {
      type: String,
      required: true,
      trim: true,
    },

    usageInstructions: {
      type: String,
      required: true,
    },

    storageInstructions: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Settings ─────────────────────────────────────
    isHalal: {
      type: Boolean,
      default: false,
    },

    isInstitutional: {
      type: Boolean,
      default: false,
    },

    fssaiNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    manufacturer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    lowStockAlert: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isDefault: {
      type: Boolean,
      default: false,
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
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MasalaItem", masalaItemSchema);
