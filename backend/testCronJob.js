const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Subscription = require("./models/subscriptionModel");
const Notification = require("./models/notificationModel");

// Load env vars
dotenv.config({ path: path.join(__dirname, ".env") });

const runTest = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("Connected to DB...");

    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 10);
    targetDate.setHours(12, 0, 0, 0);

    // Find a subscription to test with
    let sub = await Subscription.findOne({ status: "ACTIVE" });
    if (sub) {
      console.log(`Updating subscription ${sub._id} to expire in exactly 10 days for testing...`);
      sub.endDate = targetDate;
      await sub.save();
    } else {
      console.log("No active subscriptions found in the database to test with. Please create one first.");
      process.exit(0);
    }

    // --- CRON LOGIC ---
    console.log("\n[CRON] Running daily subscription check...");
    const targetDateStart = new Date(today);
    targetDateStart.setDate(targetDateStart.getDate() + 10);
    targetDateStart.setHours(0, 0, 0, 0);

    const targetDateEnd = new Date(today);
    targetDateEnd.setDate(targetDateEnd.getDate() + 10);
    targetDateEnd.setHours(23, 59, 59, 999);

    const expiringSubscriptions = await Subscription.find({
      status: "ACTIVE",
      endDate: {
        $gte: targetDateStart,
        $lte: targetDateEnd
      }
    });

    console.log(`[CRON] Found ${expiringSubscriptions.length} subscriptions expiring in 10 days.`);

    for (const s of expiringSubscriptions) {
      const notification = new Notification({
        type: "SUBSCRIPTION_ALERT",
        title: "Subscription Expiring Soon",
        message: `Your ${s.plan || ""} subscription is expiring in 10 days (on ${new Date(s.endDate).toLocaleDateString()}). Please renew to avoid service disruption.`,
        franchiseId: s.franchise,
        data: { subscriptionId: s._id, endDate: s.endDate }
      });
      await notification.save();
      console.log(`[CRON] Sent 10-day subscription alert to franchise ${s.franchise}`);
    }

    console.log("[CRON] Daily subscription check completed.");
    process.exit(0);

  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
};

runTest();
