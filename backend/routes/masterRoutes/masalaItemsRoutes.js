const express = require("express");
const router = express.Router();

const {
  createMasalaItem,
  getMasalaItems,
  getMasalaItemById,
  updateMasalaItem,
  deleteMasalaItem,
} = require("../../controllers/masterController/masalaItemsController");

router.post("/", createMasalaItem);
router.get("/", getMasalaItems);
router.get("/:id", getMasalaItemById);
router.put("/:id", updateMasalaItem);
router.delete("/:id", deleteMasalaItem);

module.exports = router;
