// models/masterModels/MasalaItemModel.js

const mongoose = require("mongoose");

const masalaItemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

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
