const mongoose = require("mongoose");

const leadSourceSchema = new mongoose.Schema(
{
  leadSourceCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },

  leadSourceName: {
    type: String,
    required: true,
    trim: true
  },

  leadSourceType: {
    type: String,
    required: true,
    enum: [
      "OFFLINE",
      "DIGITAL",
      "SOCIAL_MEDIA",
      "REFERRAL",
      "EVENT"
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

module.exports = mongoose.model("LeadSource", leadSourceSchema);