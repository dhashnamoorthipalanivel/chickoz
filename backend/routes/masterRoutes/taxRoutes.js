const express = require("express");
const router = express.Router();

const {
  createTax,
  getTaxes,
  getTaxById,
  updateTax,
  deleteTax,
} = require("../../controllers/masterController/taxController");

router.post("/", createTax);
router.get("/", getTaxes);
router.get("/:id", getTaxById);
router.put("/:id", updateTax);
router.delete("/:id", deleteTax);

module.exports = router;
