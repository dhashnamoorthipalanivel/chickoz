const express = require("express");
const router = express.Router();
const { getNotifications, sendNotification, markAsRead, markAllAsRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.post("/send", protect, sendNotification);
router.patch("/:id/read", protect, markAsRead);
router.patch("/mark-all-read", protect, markAllAsRead);

module.exports = router;
