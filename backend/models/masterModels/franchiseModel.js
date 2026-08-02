const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema(
  {
    franchiseId: {
      type: String,
      required: true,
      unique: true,
    },

    referenceId: {
      type: String,
      required: true,
      unique: true,
    },

    franchiseName: {
      type: String,
      default: "",
    },

    ownerName: {
      type: String,
      required: true,
    },

    manager: {
      type: String,
      default: "",
    },

    contact: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      default: "",
    },

    packageName: {
      type: String,
      default: "",
    },

    status: {
      type: String,

      enum: ["ACTIVE", "UNDER_MAINTENANCE", "INACTIVE", "CLOSED"],

      default: "ACTIVE",
    },

    address: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    postCode: {
      type: String,
      default: "",
    },

    openingDate: {
      type: Date,
      default: null,
    },

    isActiveForBilling: {
      type: Boolean,
      default: true,
    },

    allowMenuControl: {
      type: Boolean,
      default: true,
    },

    allowReports: {
      type: Boolean,
      default: true,
    },

    logo: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    inviteStatus: {
      type: String,

      enum: ["DRAFT", "INVITE_SENT", "ACTIVE", "EXPIRED"],

      default: "DRAFT",
    },

    inviteToken: {
      type: String,

      default: "",
    },

    inviteExpiry: {
      type: Date,

      default: null,
    },

    inviteSentAt: {
      type: Date,

      default: null,
    },

    inviteCount: {
      type: Number,
      default: 0,
    },

    passwordSetupAt: {
      type: Date,
      default: null,
    },

    isLoginEnabled: {
      type: Boolean,
      default: true,
    },
    assignedMenus: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },

        // ✅ SNAPSHOT DATA
        menuCode: {
          type: String,
          default: "",
        },

        menuName: {
          type: String,
          default: "",
        },

        category: {
          type: String,
          default: "",
        },

        foodType: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
          default: 0,
        },

        image: {
          type: String,
          default: "",
        },

        // ✅ COMBO
        isCombo: {
          type: Boolean,
          default: false,
        },

        // ✅ ADMIN ASSIGNED
        isAssigned: {
          type: Boolean,
          default: true,
        },

        // ✅ FRANCHISE BILLING VISIBILITY
        isVisibleInBilling: {
          type: Boolean,
          default: true,
        },

        // ✅ SALE PRICE OVERRIDE
        salePrice: {
          type: Number,
          default: null,
        },
      },
    ],

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Franchise", franchiseSchema);
