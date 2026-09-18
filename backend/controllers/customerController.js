const Customer = require("../models/customerModel");
const CustomerFranchise = require("../models/customerFranchiseModel");
const Franchise = require("../models/masterModels/franchiseModel");

// CREATE CUSTOMER
// exports.createCustomer = async (req, res) => {
//   try {
//     const { customerName, mobile, email } = req.body;

//     // VALIDATION
//     if (!customerName || !mobile) {
//       return res.status(400).json({
//         message: "Customer name and mobile are required",
//       });
//     }

//     // CHECK MOBILE EXISTS
//     const existingCustomer = await Customer.findOne({
//       mobile,
//     });

//     if (existingCustomer) {
//       return res.status(400).json({
//         message: "Customer already exists",
//       });
//     }

//     // CREATE CUSTOMER
//     const customer = await Customer.create({
//       customerName,

//       mobile,

//       email,
//     });

//     res.status(201).json({
//       success: true,

//       message: "Customer created successfully",

//       customer,
//     });
//   } catch (error) {
//     console.log("CREATE CUSTOMER ERROR:", error.message);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

exports.createCustomer = async (req, res) => {
  try {
    const { customerName, mobile, email, franchiseId } = req.body;

    // VALIDATION
    if (!customerName || !mobile || !franchiseId) {
      return res.status(400).json({
        message: "Customer name, mobile and franchise are required",
      });
    }

    // CHECK FRANCHISE
    const franchise = await Franchise.findById(franchiseId);

    if (!franchise) {
      return res.status(404).json({
        message: "Franchise not found",
      });
    }

    // CHECK CUSTOMER IN THIS FRANCHISE
    let customer = await Customer.findOne({
      mobile,
      creatorFranchiseId: franchise._id,
    });

    if (customer) {
      return res.status(400).json({
        message: "Customer already exists in this franchise",
      });
    }

    // CREATE CUSTOMER
    const customerCount = await Customer.countDocuments({ creatorFranchiseId: franchise._id });
    const seq = (customerCount + 1).toString().padStart(3, "0");
    const fId = franchise.franchiseId || franchise.referenceId || "Fran01";
    const customerRefId = `Chic${fId}-cus${seq}`;

    customer = await Customer.create({
      customerName,
      mobile,
      email,
      creatorFranchiseId: franchise._id,
      customerRefId,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.log("CREATE CUSTOMER ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CUSTOMER BY MOBILE
exports.getCustomerByMobile = async (req, res) => {
  try {
    const { mobile, franchiseId } = req.params;

    // FIND CUSTOMER IN THIS FRANCHISE
    const customer = await Customer.findOne({
      mobile,
      creatorFranchiseId: franchiseId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found in this franchise",
      });
    }

    // SUCCESS
    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.log("GET CUSTOMER ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getFranchiseCustomers =
  async (req, res) => {

    try {

      const { franchiseId } =
        req.params;

      const customers = await Customer.find({
        creatorFranchiseId: franchiseId,
      }).populate("creatorFranchiseId");

      res.status(200).json({

        success: true,

        customers,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });
    }
  };

// GET ALL CUSTOMERS (Admin sees all, franchise sees theirs)
exports.getAllCustomers = async (req, res) => {
  try {
    const { franchiseId } = req.query;
    
    let customers = [];
    if (franchiseId) {
      // Franchise specific customers
      customers = await Customer.find({ creatorFranchiseId: franchiseId }).populate("creatorFranchiseId");
    } else {
      // Admin sees all
      customers = await Customer.find({}).populate("creatorFranchiseId");
    }

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
