const express = require("express");

const router = express.Router();

const {
  getKishoks,
  getKishokById,
  updateKishok,
} = require("../controllers/kishokController");

router.get("/", getKishoks);

router.get("/:id", getKishokById);

router.put("/:id", updateKishok);

module.exports = router;