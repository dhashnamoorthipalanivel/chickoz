const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // 🔥 COMMON REFERENCE ID
    referenceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // 👤 BASIC DETAILS
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    place: {
      type: String,
      required: true,
    },

    postCode: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // 📦 PACKAGE
    interestedPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    // 📢 LEAD SOURCE
    leadSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSource",
      required: true,
    },

    // 👨‍💼 ASSIGNED USER
    assignedTo: {
      type: String,
      required: true,
    },

    // 📊 LEAD STATUS
    leadStatus: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "HOLD", "CANCELLED", "RETURN", "COMPLETED"],
      default: "NEW",
    },

    // ===================================================
    // 🔥 WIZARD STAGES
    // ===================================================

    stages: {
      // 1️⃣ SITE VISIT
      SITE_VISIT: {
        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },

        data: {
          visitType: {
            type: String,
            default: "",
          },

          visitDate: {
            type: Date,
            default: null,
          },

          location: {
            type: String,
            default: "",
          },

          deliveryLocation: {
            type: String,
            default: "",
          },
        },
      },

      // 2️⃣ APPROVAL
      APPROVAL: {
        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },

        data: {
          siteStatus: {
            type: String,
            default: "",
          },

          approvalStatus: {
            type: String,
            default: "",
          },

          legalStatus: {
            type: String,
            default: "",
          },
        },
      },

      // 3️⃣ TRAINING
      TRAINING: {
        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },

        data: {
          trainingStatus: {
            type: String,
            default: "",
          },

          trainingStart: {
            type: Date,
            default: null,
          },

          parentsDetails: {
            type: String,
            default: "",
          },

          // 🔥 CART REQUIRED
          cartRequired: {
            type: String,
            enum: ["yes", "no"],
            default: "no",
          },

          // 🔥 SHOW ONLY IF YES
          cartRequiredDate: {
            type: Date,
            default: null,
          },

          cartPriority: {
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
          cartManufactureStatus: {
            type: String,

            enum: [
              "NOT_REQUIRED",
              "PENDING",
              "ASSIGNED",
              "IN_PROGRESS",
              "HOLD",
              "CANCELLED",
              "COMPLETED",
            ],

            default: "NOT_REQUIRED",
          },
          cartAssignedVendor: {
            type: String,
            default: "",
          },
        },
      },

      // 4️⃣ PAYMENT
      PAYMENT: {
        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },

        data: {
          // ✅ PACKAGE SUMMARY

          packageAmount: {
            type: Number,
            default: 0,
          },

          cartAmount: {
            type: Number,
            default: 0,
          },

          gstPercentage: {
            type: Number,
            default: 0,
          },

          totalAmount: {
            type: Number,
            default: 0,
          },

          advanceAmount: {
            type: Number,
            default: 0,
          },

          royaltyType: {
            type: String,
            default: "",
          },

          royaltyValue: {
            type: Number,
            default: 0,
          },

          // ✅ PAYMENT HISTORY

          payments: [
            {
              amount: {
                type: Number,
                default: 0,
              },

              date: {
                type: Date,
                default: null,
              },

              paymentMode: {
                type: mongoose.Schema.Types.ObjectId,

                ref: "PaymentMode",
              },

              remarks: {
                type: String,
                default: "",
              },
            },
          ],

          // ✅ PAYMENT SUMMARY

          paidAmount: {
            type: Number,
            default: 0,
          },

          pendingAmount: {
            type: Number,
            default: 0,
          },
        },
      },

      // 5️⃣ FINAL SETUP
      FINAL_SETUP: {
        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },

        data: {
          contractSigned: {
            type: String,
            default: "",
          },

          bankDetails: {
            type: String,
            default: "",
          },

          kycDocument: {
            type: String,
            default: "",
          },

          kycDocumentName: {
            type: String,
            default: "",
          },

          royaltyDocument: {
            type: String,
            default: "",
          },

          royaltyDocumentName: {
            type: String,
            default: "",
          },
        },
      },
    },

    // 📝 REMARKS
    remarks: {
      type: String,
      default: "",
    },

    // 🔁 CONVERTED FROM ENQUIRY
    convertedFromEnquiry: {
      type: Boolean,
      default: true,
    },

    // 🗑️ SOFT DELETE
    isDeleted: {
      type: Boolean,
      default: false,
    },

    isFranchiseCreated: {
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

module.exports = mongoose.model("Lead", leadSchema);
