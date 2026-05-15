const express = require("express");

const router = express.Router();

const {
  getFranchises,
  getFranchiseById,
  updateFranchise,
  verifyInviteToken,
  sendFranchiseInvite,
  setupPassword,
} = require("../../controllers/masterController/franchiseController");

router.get("/", getFranchises);

router.get("/verify-invite-token", verifyInviteToken);

router.post("/send-invitation/:id", sendFranchiseInvite);
router.get("/:id", getFranchiseById);

router.put("/:id", updateFranchise);
router.post("/setup-password", setupPassword);

module.exports = router;
