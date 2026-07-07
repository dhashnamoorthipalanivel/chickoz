const mongoose = require("mongoose");

const PLAN_DAYS = {
  TRIAL:       14,
  MONTHLY:     30,
  QUARTERLY:   90,
  HALF_YEARLY: 180,
  YEARLY:      365,
};

const subscriptionSchema = new mongoose.Schema(
  {
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      required: true,
      unique: true,
    },

    franchiseName: { type: String, default: "" },
    franchiseCode: { type: String, default: "" },
    ownerName:     { type: String, default: "" },
    contact:       { type: String, default: "" },

    plan: {
      type: String,
      enum: ["TRIAL", "MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"],
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "SUSPENDED"],
      default: "ACTIVE",
    },

    notes: { type: String, default: "" },

    paymentHistory: [
      {
        receiptNo:       { type: String,  default: "" },
        amount:          { type: Number,  default: 0  },
        plan:            { type: String,  default: "" },
        daysAdded:       { type: Number,  default: 0  },
        previousEndDate: { type: Date,    default: null },
        newEndDate:      { type: Date,    default: null },
        paidAt:          { type: Date,    default: null },
        notes:           { type: String,  default: "" },
        createdBy:       { type: String,  default: "" },
      },
    ],

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date,    default: null  },
  },
  { timestamps: true }
);

subscriptionSchema.statics.PLAN_DAYS = PLAN_DAYS;

module.exports = mongoose.model("Subscription", subscriptionSchema);
