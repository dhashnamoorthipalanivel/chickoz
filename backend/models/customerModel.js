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
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },
    customerRefId: {
      type: String,
    },
    creatorFranchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Customer", customerSchema);
