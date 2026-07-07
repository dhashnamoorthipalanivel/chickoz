const express = require("express");
const router = express.Router();

const {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require("../../controllers/masterController/materialController");

router.post("/", createMaterial);
router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

module.exports = router;
