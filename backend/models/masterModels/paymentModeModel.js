const mongoose = require("mongoose");

const paymentModeSchema = new mongoose.Schema(
{
  paymentCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },

  paymentName: {
    type: String,
    required: true,
    trim: true
  },

  paymentType: {
    type: String,
    required: true,
    enum: [
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER",
      "WALLET",
      "CREDIT"
    ]
  },

  description: {
    type: String,
    default: ""
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

module.exports = mongoose.model("PaymentMode", paymentModeSchema);