const mongoose = require("mongoose");

const kishokSchema = new mongoose.Schema(
  {
    // ✅ LEAD REFERENCE
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },
    leadStatus: {
      type: String,

      enum: ["NEW", "IN_PROGRESS", "HOLD", "RETURN", "CANCELLED", "COMPLETED"],

      default: "NEW",
    },
    // ✅ REQUIREMENT STAGE
    customerName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },

    place: {
      type: String,
      default: "",
    },

    packageName: {
      type: String,
      default: "",
    },

    cartSize: {
      type: String,
      default: "",
    },

    cartAmount: {
      type: Number,
      default: 0,
    },

    brandingType: {
      type: String,
      default: "",
    },

    accessories: {
      type: String,
      default: "",
    },

    requiredDate: {
      type: Date,
      default: null,
    },

    priority: {
      type: String,
      enum: ["Normal", "Urgent"],
      default: "Normal",
    },

    // ✅ VENDOR ASSIGN
    vendorName: {
      type: String,
      default: "",
    },

    vendorPhone: {
      type: String,
      default: "",
    },

    assignDate: {
      type: Date,
      default: null,
    },

    expectedDate: {
      type: Date,
      default: null,
    },

    // ✅ PRODUCTION
    manufactureStatus: {
      type: String,

      enum: [
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "HOLD",
        "CANCELLED",
        "COMPLETED",
      ],

      default: "PENDING",
    },

    dispatchDate: {
      type: Date,
      default: null,
    },

    cartImage: {
      type: String,
      default: "",
    },

    cartImageName: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    // ✅ PAYMENT
    payments: [
      {
        amount: {
          type: Number,
          default: 0,
        },

        paymentDate: {
          type: Date,
          default: null,
        },

        paymentMode: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PaymentMode",
          default: null,
        },
      },
    ],

    paidAmount: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },

    completedStages: {
      type: [String],
      default: [],
    },
    isFranchiseCreated: {
      type: Boolean,
      default: false,
    },

    // ✅ COMMON
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

module.exports = mongoose.model("Kishok", kishokSchema);
