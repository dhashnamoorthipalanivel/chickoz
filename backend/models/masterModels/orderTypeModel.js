const mongoose = require("mongoose");

const orderTypeSchema = new mongoose.Schema(
{
  orderTypeCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },

  orderTypeName: {
    type: String,
    required: true,
    trim: true
  },

  shortName: {
    type: String,
    trim: true,
    uppercase: true,
    default: ""
  },

  description: {
    type: String,
    default: ""
  },

  serviceChargeApplicable: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  },

  isDefault: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date,
    default: null
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("OrderType", orderTypeSchema);