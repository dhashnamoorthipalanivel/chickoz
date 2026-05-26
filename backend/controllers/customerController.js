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

    // CHECK GLOBAL CUSTOMER
    let customer = await Customer.findOne({
      mobile,
    });

    // CREATE CUSTOMER IF NOT EXISTS
    if (!customer) {
      customer = await Customer.create({
        customerName,
        mobile,
        email,
      });
    }

    // CHECK CUSTOMER ALREADY EXISTS
    // IN THIS FRANCHISE

    const existingCustomerFranchise = await CustomerFranchise.findOne({
      customerId: customer._id,
      franchiseId,
    });

    if (existingCustomerFranchise) {
      return res.status(400).json({
        message: "Customer already exists in this franchise",
      });
    }

    // CREATE FRANCHISE MAPPING
    await CustomerFranchise.create({
      customerId: customer._id,
      franchiseId,
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

    // FIND CUSTOMER
    const customer = await Customer.findOne({
      mobile,
    });

    // NO GLOBAL CUSTOMER
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // CHECK CUSTOMER
    // INSIDE FRANCHISE
    const customerFranchise = await CustomerFranchise.findOne({
      customerId: customer._id,
      franchiseId,
    });

    // NOT FOUND
    // IN THIS FRANCHISE

    if (!customerFranchise) {
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

        const mappings =
            await CustomerFranchise
                .find({
                    franchiseId
                })
                .populate(
                    "customerId"
                );

        const customers =
            mappings.map(
                (item) =>
                    item.customerId
            );

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
