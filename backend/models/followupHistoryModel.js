const mongoose = require("mongoose");

const followupHistorySchema = new mongoose.Schema(
  {
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      required: true,
      index: true,
    },
    followUpDate: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["NEW", "FOLLOW_UP", "HOLD", "CANCELLED", "CONVERTED_TO_LEAD"],
    },
    addedBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowupHistory", followupHistorySchema);
