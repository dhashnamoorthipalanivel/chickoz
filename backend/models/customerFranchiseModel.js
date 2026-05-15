const mongoose = require("mongoose");

const customerFranchiseSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Customer",

      required: true,
    },

    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Franchise",

      required: true,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "CustomerFranchise",

  customerFranchiseSchema,
);
