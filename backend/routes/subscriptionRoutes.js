const router  = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const ctrl     = require("../controllers/subscriptionController");

router.get("/",                       protect, ctrl.getAll);
router.get("/my",                     protect, ctrl.getMy);
router.get("/:franchiseId",           protect, ctrl.getByFranchise);
router.post("/:franchiseId/enable",   protect, ctrl.enable);
router.put("/:franchiseId/extend",    protect, ctrl.extend);
router.put("/:franchiseId/suspend",   protect, ctrl.suspend);

module.exports = router;
