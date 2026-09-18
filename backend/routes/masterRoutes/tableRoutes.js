const express = require("express");
const router = express.Router();
const tableController = require("../../controllers/masterController/tableController");
// const authMiddleware = require("../../middleware/authMiddleware"); // Optional based on standard practice in this repo

router.post("/", tableController.createTable);
router.get("/", tableController.getAllTables);
router.get("/:id", tableController.getTableById);
router.put("/:id", tableController.updateTable);
router.delete("/:id", tableController.deleteTable);

module.exports = router;
