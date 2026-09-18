const cron = require("node-cron");
const Enquiry = require("../models/enquiryModel");
const Notification = require("../models/notificationModel");

// Helper to check if a notification already exists for today to avoid duplicates
const createUniqueNotification = async (payload) => {
  const existing = await Notification.findOne({
    type: payload.type,
    "data.targetId": payload.data.targetId,
    "data.date": payload.data.date
  });

  if (!existing) {
    await Notification.create(payload);
  }
};

const runFollowUpCheck = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const todayString = today.toISOString().split("T")[0];

    // Find all Enquiries with followups scheduled for today
    const activeEnquiries = await Enquiry.find({
      isDeleted: false,
      isConverted: false,
      followUpDate: { $gte: today, $lte: endOfDay }
    });

    for (const enquiry of activeEnquiries) {
      await createUniqueNotification({
        type: "FOLLOW_UP_REMINDER",
        title: "Follow-up Due Today",
        message: `You have a scheduled follow-up for ${enquiry.name} (${enquiry.referenceId}) today.`,
        data: {
          targetId: enquiry._id.toString(),
          targetType: "Enquiry",
          date: todayString,
          url: `/crm-enquiry/edit/${enquiry._id}`
        }
      });
    }

    // TODO: Also scan Leads if the Lead model has followUpDate
    
  } catch (error) {
    console.error("FollowUp Cron Error:", error);
  }
};

// Run every day at 12:01 AM
cron.schedule("1 0 * * *", () => {
  console.log("Running daily follow-up check...");
  runFollowUpCheck();
});

module.exports = {
  runFollowUpCheck // exported for instant manual trigger if needed
};
