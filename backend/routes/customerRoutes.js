const express = require("express");

const router = express.Router();

const {
  createCustomer,
  getCustomerByMobile,
  getFranchiseCustomers,
} = require("../controllers/customerController");

// CREATE CUSTOMER
router.post("/create", createCustomer);

// GET CUSTOMER BY MOBILE
router.get(
  "/mobile/:mobile/:franchiseId",
  getCustomerByMobile,
);

router.get(
    "/franchise/:franchiseId",
    getFranchiseCustomers
);

module.exports = router;
