const mongoose = require("mongoose");

const comboItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const menuSchema = new mongoose.Schema(
  {
    menuCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    menuName: {
      type: String,
      required: true,
      trim: true,
    },
    portionQty: {
      type: Number,
      required: true,
      min: 1,
    },

    portionName: {
      type: String,
      required: true,
      enum: [
        "PCS",
        "GRAM",
        "ML",
        "MINI",
        "NORMAL",
        "MEDIUM",
        "LARGE",
        "CHEESE",
      ],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "FRIED_CHICKEN",
        "NUGGETS",
        "FRIES",
        "SANDWICH",
        "FRANKIES",
        "BURGER",
        "MOMOS",
        "MOJITO",
        "BUBBLE_TEA",
        "DESSERT",
        "COMBO",
      ],
    },

    foodType: {
      type: String,
      required: true,
      enum: ["VEG", "NON_VEG", "BEVERAGE", "DESSERT"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    hasOffer: {
      type: Boolean,
      default: false,
    },

    offerType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      default: null,
    },

    offerValue: {
      type: Number,
      default: 0,
    },

    offerStartDate: {
      type: Date,
      default: null,
    },

    offerEndDate: {
      type: Date,
      default: null,
    },

    isTaxApplicable: {
      type: Boolean,
      default: false,
    },

    taxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      required: false,
    },

    comboItems: {
      type: [comboItemSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isCombo: {
      type: Boolean,
      default: false,
    },

    isAddonAllowed: {
      type: Boolean,
      default: false,
    },

    addons: [
      {
        addonName: {
          type: String,
          trim: true,
        },

        price: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],

    customizationOptions: [
      {
        label: {
          type: String,
          trim: true,
        },
      },
    ],

    isVisibleInBilling: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

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

// combo validation
menuSchema.pre("save", function () {
  if (this.isCombo && this.comboItems.length === 0) {
    throw new Error("Combo item must contain at least one menu item");
  }

  if (!this.isCombo) {
    this.comboItems = [];
  }
});

module.exports = mongoose.model("Menu", menuSchema);
