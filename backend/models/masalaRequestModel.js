// ======================================================
// models/masalaRequestModel.js
// FULL UPDATED PROFESSIONAL MODEL
// ======================================================

const mongoose = require("mongoose");

const masalaRequestSchema = new mongoose.Schema(
  {
    // ======================================================
    // REQUEST ID
    // ======================================================

    requestId: {
      type: String,

      unique: true,
    },

    // ======================================================
    // FRANCHISE
    // ======================================================

    franchise: {
      franchiseId: {
        type: String,

        required: true,
      },

      franchiseName: {
        type: String,

        required: true,
      },

      phone: {
        type: String,

        default: "",
      },

      location: {
        type: String,

        default: "",
      },

      email: {
        type: String,

        default: "",
      },
    },

    // ======================================================
    // ITEMS
    // ======================================================

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "MasalaItem",

          required: true,
        },

        itemName: {
          type: String,

          required: true,
        },

        packSize: {
          type: Number,

          required: true,
        },

        unit: {
          type: String,

          required: true,
        },

        price: {
          type: Number,

          required: true,

          default: 0,
        },

        quantity: {
          type: Number,

          required: true,
        },

        amount: {
          type: Number,

          default: 0,
        },
      },
    ],

    // ======================================================
    // TOTALS
    // ======================================================

    totalItems: {
      type: Number,

      default: 0,
    },

    totalQty: {
      type: Number,

      default: 0,
    },

    totalAmount: {
      type: Number,

      default: 0,
    },

    // ======================================================
    // REQUIRED DATE
    // ======================================================

    requiredDate: {
      type: Date,

      required: true,
    },

    // ======================================================
    // PRIORITY
    // ======================================================

    priority: {
      type: String,

      enum: ["Normal", "Urgent"],

      default: "Normal",
    },

    // ======================================================
    // PAYMENT OPTION
    // ======================================================

    paymentOption: {
  type: String,
  required: true,
},

    // ======================================================
    // PAYMENT STATUS
    // ======================================================

    paymentStatus: {
      type: String,

      enum: ["UNPAID", "PARTIAL", "PAID"],

      default: "UNPAID",
    },

    // ======================================================
    // PAYMENT HISTORY
    // ======================================================

    paymentHistory: [
      {
        amount: {
          type: Number,

          default: 0,
        },

        paymentMethod: {
          type: String,

          default: "",
        },

        referenceNo: {
          type: String,

          default: "",
        },

        paymentDate: {
          type: Date,

          default: Date.now,
        },

        remarks: {
          type: String,

          default: "",
        },
      },
    ],

    // ======================================================
    // STATUS HISTORY
    // ======================================================

    statusHistory: [
      {
        status: {
          type: String,
        },

        remarks: {
          type: String,

          default: "",
        },

        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "User",
        },

        updatedAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],

    // ======================================================
    // REMARKS
    // ======================================================

    remarks: {
      type: String,

      default: "",
    },

    adminRemarks: {
      type: String,

      default: "",
    },

    // ======================================================
    // STATUS
    // ======================================================

    status: {
      type: String,

      enum: [
        "REQUESTED",

        "UNDER_REVIEW",

        "APPROVED",

        "PROCESSING",

        "DISPATCHED",

        "DELIVERED",

        "REJECTED",

        "CANCELLED",
      ],

      default: "REQUESTED",
    },

    // ======================================================
    // APPROVAL
    // ======================================================

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    approvedDate: {
      type: Date,

      default: null,
    },

    // ======================================================
    // DISPATCH
    // ======================================================

    transportName: {
      type: String,

      default: "",
    },

    trackingNumber: {
      type: String,

      default: "",
    },

    dispatchRemarks: {
      type: String,

      default: "",
    },

    dispatchedDate: {
      type: Date,

      default: null,
    },

    // ======================================================
    // DELIVERY
    // ======================================================

    deliveredDate: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MasalaRequest", masalaRequestSchema);
