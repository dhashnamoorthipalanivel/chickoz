const express = require("express");

const router = express.Router();

const {
  createCustomer,
  getCustomerByMobile,
} = require("../controllers/customerController");

// CREATE CUSTOMER
router.post("/create", createCustomer);

// GET CUSTOMER BY MOBILE
router.get(
  "/mobile/:mobile/:franchiseId",
  getCustomerByMobile,
);

module.exports = router;
