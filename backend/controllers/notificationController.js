const Notification = require("../models/notificationModel");
const Franchise = require("../models/masterModels/franchiseModel");

// Helper to escape regex special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET ALL (admin sees admin-only alerts like NEW_MASALA_REQUEST & LOW_STOCK; franchise sees strictly their own notifications)
exports.getNotifications = async (req, res) => {
  try {
    const user = req.user;
    const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

    let query = {};

    if (isAdmin) {
      // Admin sees notifications intended for Admin (incoming requests, inventory alerts)
      // Excludes outgoing messages sent by admin to franchises and status updates delivered to franchises
      query = {
        type: { $nin: ["ADMIN_MESSAGE", "MASALA_REQUEST_STATUS"] }
      };
    } else {
      let franchiseId = user?.franchiseId;
      let franchiseName = "";

      if (franchiseId) {
        const foundFran = await Franchise.findById(franchiseId);
        if (foundFran) {
          franchiseName = foundFran.franchiseName;
        }
      }

      if (!franchiseId || !franchiseName) {
        const foundFran = await Franchise.findOne({
          $or: [{ email: user?.email }, { contact: user?.phone }],
          isDeleted: false
        });
        if (foundFran) {
          franchiseId = foundFran._id;
          franchiseName = foundFran.franchiseName;
        }
      }

      if (franchiseId) {
        const orConditions = [
          { franchiseId: franchiseId },
          { "data.franchiseId": franchiseId.toString() },
          { "data.franchiseId": franchiseId }
        ];
        if (franchiseName) {
          orConditions.push({ "data.franchiseName": new RegExp("^" + escapeRegex(franchiseName.trim()) + "$", "i") });
        }
        query = { $or: orConditions };
      } else {
        // Non-admin user with no linked franchise gets ZERO notifications
        query = { _id: null };
      }
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// SEND MESSAGE FROM ADMIN TO A PARTICULAR FRANCHISE (OR ALL)
exports.sendNotification = async (req, res) => {
  try {
    const { franchiseId, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    if (franchiseId === "ALL") {
      const franchises = await Franchise.find({ isDeleted: false });
      const docs = franchises.map(f => ({
        type: "ADMIN_MESSAGE",
        title: title.trim(),
        message: message.trim(),
        franchiseId: f._id,
        data: { sender: req.user?.firstName || "Admin", franchiseName: f.franchiseName },
        isRead: false
      }));
      await Notification.insertMany(docs);
      return res.json({
        success: true,
        message: `Message broadcasted to all ${franchises.length} franchises successfully`
      });
    } else {
      if (!franchiseId) {
        return res.status(400).json({
          success: false,
          message: "Franchise selection is required"
        });
      }

      const franchise = await Franchise.findById(franchiseId);
      if (!franchise) {
        return res.status(404).json({
          success: false,
          message: "Selected Franchise not found"
        });
      }

      const newNotif = await Notification.create({
        type: "ADMIN_MESSAGE",
        title: title.trim(),
        message: message.trim(),
        franchiseId: franchise._id,
        data: { sender: req.user?.firstName || "Admin", franchiseName: franchise.franchiseName },
        isRead: false
      });

      return res.json({
        success: true,
        message: `Message sent to ${franchise.franchiseName} successfully`,
        data: newNotif
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// MARK ONE AS READ
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// MARK ALL AS READ (scoped to user role / franchise)
exports.markAllAsRead = async (req, res) => {
  try {
    const user = req.user;
    const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

    let query = { isRead: false };

    if (isAdmin) {
      query = {
        isRead: false,
        type: { $nin: ["ADMIN_MESSAGE", "MASALA_REQUEST_STATUS"] }
      };
    } else {
      let franchiseId = user?.franchiseId;
      let franchiseName = "";

      if (franchiseId) {
        const foundFran = await Franchise.findById(franchiseId);
        if (foundFran) franchiseName = foundFran.franchiseName;
      }

      if (!franchiseId || !franchiseName) {
        const foundFran = await Franchise.findOne({
          $or: [{ email: user?.email }, { contact: user?.phone }],
          isDeleted: false
        });
        if (foundFran) {
          franchiseId = foundFran._id;
          franchiseName = foundFran.franchiseName;
        }
      }

      if (franchiseId) {
        const orConditions = [
          { franchiseId: franchiseId },
          { "data.franchiseId": franchiseId.toString() },
          { "data.franchiseId": franchiseId }
        ];
        if (franchiseName) {
          orConditions.push({ "data.franchiseName": new RegExp("^" + escapeRegex(franchiseName.trim()) + "$", "i") });
        }
        query = { isRead: false, $or: orConditions };
      } else {
        query = { _id: null };
      }
    }

    await Notification.updateMany(query, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
