const cron = require("node-cron");
const Subscription = require("../models/subscriptionModel");
const Notification = require("../models/notificationModel");

const initSubscriptionCron = () => {
  // Run every day at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[CRON] Running daily subscription check...");
      
      const today = new Date();
      // Target date: 10 days from now
      const targetDateStart = new Date(today);
      targetDateStart.setDate(targetDateStart.getDate() + 10);
      targetDateStart.setHours(0, 0, 0, 0);

      const targetDateEnd = new Date(today);
      targetDateEnd.setDate(targetDateEnd.getDate() + 10);
      targetDateEnd.setHours(23, 59, 59, 999);

      // Find subscriptions active and expiring in 10 days
      const expiringSubscriptions = await Subscription.find({
        status: "ACTIVE",
        endDate: {
          $gte: targetDateStart,
          $lte: targetDateEnd
        }
      });

      for (const sub of expiringSubscriptions) {
        // Create an in-app notification
        const notification = new Notification({
          type: "SUBSCRIPTION_ALERT",
          title: "Subscription Expiring Soon",
          message: `Your ${sub.plan || ""} subscription is expiring in 10 days (on ${new Date(sub.endDate).toLocaleDateString()}). Please renew to avoid service disruption.`,
          franchiseId: sub.franchise,
          data: { subscriptionId: sub._id, endDate: sub.endDate }
        });
        
        await notification.save();
        console.log(`[CRON] Sent 10-day subscription alert to franchise ${sub.franchise}`);
      }
      
      console.log(`[CRON] Daily subscription check completed. Alerted ${expiringSubscriptions.length} franchises.`);
    } catch (error) {
      console.error("[CRON] Error running subscription cron job:", error);
    }
  });
};

module.exports = initSubscriptionCron;
