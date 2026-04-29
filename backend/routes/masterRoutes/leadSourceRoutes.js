const express = require("express");
const router = express.Router();

const {
  createLeadSource,
  getLeadSources,
  getLeadSourceById,
  updateLeadSource,
  deleteLeadSource,
} = require("../../controllers/masterController/leadSourceController");

router.post("/", createLeadSource);
router.get("/", getLeadSources);
router.get("/:id", getLeadSourceById);
router.put("/:id", updateLeadSource);
router.delete("/:id", deleteLeadSource);

module.exports = router;
