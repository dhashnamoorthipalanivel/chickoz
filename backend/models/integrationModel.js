const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      unique: true, // e.g., 'FACEBOOK', 'GOOGLE'
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    // Meta (Facebook Lead Ads) specific credentials
    verifyToken: {
      type: String,
    },
    pageId: {
      type: String,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Integration", integrationSchema);
