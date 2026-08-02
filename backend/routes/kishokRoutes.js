const express = require("express");

const router = express.Router();

const {
  getKishoks,
  getKishokById,
  updateKishok,
} = require("../controllers/kishokController");

const { upload } = require("../utils/upload");

router.get("/", getKishoks);

router.get("/:id", getKishokById);

router.put("/:id", upload.array("cartImages", 10), updateKishok);

module.exports = router;