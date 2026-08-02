const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
{
  documentName: {
    type: String,
    required: true,
    trim: true
  },

  documentType: {
    type: String,
    required: true,
    enum: [
      "LEGAL",
      "LICENSE",
      "IDENTITY",
      "FINANCIAL",
      "MEDIA",
      "ADDRESS_PROOF"
    ]
  },

  description: {
    type: String,
    default: ""
  },

  isMandatory: {
    type: Boolean,
    default: false
  },

  validationYear: {
    type: Number,
    default: null
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
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

module.exports = mongoose.model("Document", documentSchema);