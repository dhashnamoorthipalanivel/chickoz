const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["EQUIPMENT", "UTENSIL", "UNIFORM", "ACCESSORY", "STATIONERY", "FURNITURE"],
      required: true,
    },

    powerType: {
      type: String,
      enum: ["GAS", "ELECTRIC", "MANUAL", "NOT_APPLICABLE"],
      default: "NOT_APPLICABLE",
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    unit: {
      type: String,
      enum: ["PCS", "SET", "BOX", "PAIR", "KG", "LTR"],
      default: "PCS",
    },

    description: {
      type: String,
      default: "",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
