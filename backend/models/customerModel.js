const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Customer", customerSchema);
