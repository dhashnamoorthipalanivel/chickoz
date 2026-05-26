const MasalaRequest = require("../models/masalaRequestModel");
const Franchise = require("../models/masterModels/franchiseModel");

// ======================================================
// HELPER : CALCULATE TOTALS
// ======================================================
const calculateTotals = (items) => {
  const totalItems = items.length;

  const totalQty = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0,
  );

  return {
    totalItems,
    totalQty,
    totalAmount,
  };
};

// ======================================================
// HELPER : ADMIN CHECK
// ======================================================
const isAdmin = (user) => {
  return user.role === "admin" || user.role === "super_admin";
};

// ======================================================
// CREATE MASALA REQUEST
// ======================================================
exports.createMasalaRequest = async (req, res) => {
  try {
    const { requiredDate, priority, paymentOption, remarks, items } = req.body;

    // ======================================================
    // VALIDATION
    // ======================================================
    if (
      !requiredDate ||
      !priority ||
      !paymentOption ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const invalidItem = items.some(
      (item) =>
        !item.itemId ||
        !item.itemName ||
        !item.packSize ||
        !item.unit ||
        !item.price ||
        !item.quantity,
    );

    if (invalidItem) {
      return res.status(400).json({
        success: false,
        message: "Please fill all item details",
      });
    }

    // ======================================================
    // CALCULATE TOTALS
    // ======================================================
    const { totalItems, totalQty, totalAmount } = calculateTotals(items);

    // ======================================================
    // GENERATE REQUEST ID
    // ======================================================
    const generateRequestId = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      let randomCode = "";

      for (let i = 0; i < 6; i++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return `MAS-${randomCode}`;
    };

    let requestId = generateRequestId();

    // ======================================================
    // PREPARE ITEMS
    // ======================================================
    const updatedItems = items.map((item) => ({
      ...item,

      amount: Number(item.quantity || 0) * Number(item.price || 0),
    }));

    const franchiseData = await Franchise.findById(req.user.franchiseId);

    if (!franchiseData) {
      return res.status(404).json({
        success: false,

        message: "Franchise not found",
      });
    }

    // ======================================================
    // CREATE REQUEST
    // ======================================================
    const newRequest = new MasalaRequest({
      requestId,

      franchise: {
        // BUSINESS FRANCHISE ID
        franchiseId: franchiseData.franchiseId,

        // BRANCH NAME
        franchiseName: franchiseData.franchiseName,

        phone: franchiseData.contact,

        location: franchiseData.location,

        email: franchiseData.email,
      },

      requiredDate,

      priority,

      paymentOption,

      remarks,

      items: updatedItems,

      totalItems,

      totalQty,

      totalAmount,

      paymentStatus: "UNPAID",

      status: "REQUESTED",

      // ======================================================
      // INITIAL STATUS HISTORY
      // ======================================================
      statusHistory: [
        {
          status: "REQUESTED",

          remarks: "Request created",

          updatedBy: req.user._id,

          updatedAt: new Date(),
        },
      ],
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Masala request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.log("CREATE MASALA REQUEST ERROR :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// GET FRANCHISE OWN REQUESTS
// ======================================================
exports.getMyMasalaRequests = async (req, res) => {
  try {
    const franchiseData = await Franchise.findById(req.user.franchiseId);

    if (!franchiseData) {
      return res.status(404).json({
        success: false,

        message: "Franchise not found",
      });
    }

    const franchiseId = franchiseData.franchiseId;

    const requests = await MasalaRequest.find({
      "franchise.franchiseId": franchiseId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      count: requests.length,

      data: requests,
    });
  } catch (error) {
    console.log("GET MY MASALA REQUESTS ERROR :", error);

    return res.status(500).json({
      success: false,

      message: "Internal server error",
    });
  }
};

// ======================================================
// GET SINGLE MASALA REQUEST
// ======================================================
exports.getSingleMasalaRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MasalaRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // ======================================================
    // SECURITY CHECK
    // ======================================================
    if (!isAdmin(req.user)) {
      const franchiseData = await Franchise.findById(req.user.franchiseId);

      if (!franchiseData) {
        return res.status(404).json({
          success: false,

          message: "Franchise not found",
        });
      }

      if (request.franchise.franchiseId !== franchiseData.franchiseId) {
        return res.status(403).json({
          success: false,

          message: "Access denied",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log("GET SINGLE MASALA REQUEST ERROR :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// ADMIN GET ALL REQUESTS
// ======================================================
exports.getAllMasalaRequests = async (req, res) => {
  try {
    // ======================================================
    // ADMIN SECURITY
    // ======================================================
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { status, priority, franchiseId, search } = req.query;

    let filter = {};

    if (status && status !== "ALL") {
      filter.status = status;
    }

    if (priority && priority !== "ALL") {
      filter.priority = priority;
    }

    if (franchiseId) {
      filter["franchise.franchiseId"] = franchiseId;
    }

    // ======================================================
    // SEARCH FILTER
    // ======================================================
    if (search) {
      filter.$or = [
        {
          requestId: {
            $regex: search,
            $options: "i",
          },
        },

        {
          "franchise.franchiseName": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const requests = await MasalaRequest.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.log("GET ALL MASALA REQUESTS ERROR :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// ADMIN UPDATE REQUEST STATUS
// ======================================================
exports.updateMasalaRequestStatus = async (req, res) => {
  try {
    // ======================================================
    // ADMIN SECURITY
    // ======================================================
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const {
      status,
      adminRemarks,
      transportName,
      trackingNumber,
      dispatchRemarks,
    } = req.body;

    // ======================================================
    // VALID STATUS
    // ======================================================
    const validStatuses = [
      "UNDER_REVIEW",

      "APPROVED",

      "PROCESSING",

      "DISPATCHED",

      "DELIVERED",

      "REJECTED",

      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // ======================================================
    // FIND REQUEST
    // ======================================================
    const request = await MasalaRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // ======================================================
    // UPDATE STATUS
    // ======================================================
    request.status = status;

    // ======================================================
    // STATUS HISTORY
    // ======================================================
    request.statusHistory.push({
      status,

      remarks: adminRemarks || "",

      updatedBy: req.user._id,

      updatedAt: new Date(),
    });

    // ======================================================
    // ADMIN REMARKS
    // ======================================================
    if (adminRemarks) {
      request.adminRemarks = adminRemarks;
    }

    // ======================================================
    // STATUS DATES
    // ======================================================
    if (status === "APPROVED") {
      request.approvedBy = req.user._id;

      request.approvedDate = new Date();
    }

    if (status === "DISPATCHED") {
      request.transportName = transportName || "";

      request.trackingNumber = trackingNumber || "";

      request.dispatchRemarks = dispatchRemarks || "";

      request.dispatchedDate = new Date();
    }

    if (status === "DELIVERED") {
      request.deliveredDate = new Date();
    }

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: request,
    });
  } catch (error) {
    console.log("UPDATE MASALA STATUS ERROR :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// UPDATE MASALA REQUEST
// ======================================================
exports.updateMasalaRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const { requiredDate, priority, paymentOption, remarks, items } = req.body;

    // ======================================================
    // FIND REQUEST
    // ======================================================
    const request = await MasalaRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // ======================================================
    // SECURITY CHECK
    // ======================================================
    const franchiseData = await Franchise.findById(req.user.franchiseId);

    if (!franchiseData) {
      return res.status(404).json({
        success: false,

        message: "Franchise not found",
      });
    }

    if (request.franchise.franchiseId !== franchiseData.franchiseId) {
      return res.status(403).json({
        success: false,

        message: "Access denied",
      });
    }

    // ======================================================
    // STATUS CHECK
    // ======================================================
    if (request.status !== "REQUESTED") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be edited",
      });
    }

    // ======================================================
    // VALIDATION
    // ======================================================
    if (
      !requiredDate ||
      !priority ||
      !paymentOption ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const invalidItem = items.some(
      (item) =>
        !item.itemId ||
        !item.itemName ||
        !item.packSize ||
        !item.unit ||
        !item.price ||
        !item.quantity,
    );

    if (invalidItem) {
      return res.status(400).json({
        success: false,
        message: "Please fill all item details",
      });
    }

    // ======================================================
    // CALCULATE TOTALS
    // ======================================================
    const { totalItems, totalQty, totalAmount } = calculateTotals(items);

    // ======================================================
    // PREPARE ITEMS
    // ======================================================
    const updatedItems = items.map((item) => ({
      ...item,

      amount: Number(item.quantity || 0) * Number(item.price || 0),
    }));

    // ======================================================
    // UPDATE DATA
    // ======================================================
    request.requiredDate = requiredDate;

    request.priority = priority;

    request.paymentOption = paymentOption;

    request.remarks = remarks;

    request.items = updatedItems;

    request.totalItems = totalItems;

    request.totalQty = totalQty;

    request.totalAmount = totalAmount;

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: request,
    });
  } catch (error) {
    console.log("UPDATE MASALA REQUEST ERROR :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
