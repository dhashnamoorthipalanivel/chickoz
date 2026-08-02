const Subscription = require("../models/subscriptionModel");
const Franchise = require("../models/masterModels/franchiseModel");

const PLAN_DAYS = {
  TRIAL: 14,
  MONTHLY: 30,
  QUARTERLY: 90,
  HALF_YEARLY: 180,
  YEARLY: 365,
};

const genReceiptNo = () =>
  "RCP" + Date.now().toString().slice(-7) + Math.random().toString(36).slice(2, 5).toUpperCase();

// Auto-expire active subscriptions whose end date has passed
const autoExpire = () =>
  Subscription.updateMany(
    { endDate: { $lt: new Date() }, status: "ACTIVE" },
    { $set: { status: "EXPIRED" } }
  );

// ─────────────────────────────────────────────────
// GET ALL  (admin: returns every franchise + its sub)
// ─────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    await autoExpire();

    const franchises = await Franchise.find({ isDeleted: false }).sort({ createdAt: -1 });
    const subs = await Subscription.find({ isDeleted: false });

    const subMap = {};
    subs.forEach(s => { subMap[String(s.franchise)] = s; });

    const result = franchises.map(f => ({
      franchise: f,
      subscription: subMap[String(f._id)] || null,
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// GET BY FRANCHISE  (admin)
// ─────────────────────────────────────────────────
exports.getByFranchise = async (req, res) => {
  try {
    await autoExpire();
    const sub = await Subscription.findOne({
      franchise: req.params.franchiseId,
      isDeleted: false,
    });
    res.status(200).json(sub || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// GET MY SUBSCRIPTION  (franchise user)
// ─────────────────────────────────────────────────
exports.getMy = async (req, res) => {
  try {
    if (!req.user.franchiseId) return res.status(200).json(null);
    await autoExpire();
    const sub = await Subscription.findOne({
      franchise: req.user.franchiseId,
      isDeleted: false,
    });
    res.status(200).json(sub || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// ENABLE / CREATE  (admin)
// ─────────────────────────────────────────────────
exports.enable = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const { plan, amount, startDate, notes } = req.body;

    if (!plan || !PLAN_DAYS[plan])
      return res.status(400).json({ message: "Invalid plan" });

    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) return res.status(404).json({ message: "Franchise not found" });

    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const daysAdded = PLAN_DAYS[plan];
    const end = new Date(start);
    end.setDate(end.getDate() + daysAdded);

    const receiptNo = genReceiptNo();

    const histEntry = {
      receiptNo,
      amount: Number(amount) || 0,
      plan,
      daysAdded,
      previousEndDate: null,
      newEndDate: end,
      paidAt: new Date(),
      notes: notes || "",
      createdBy: req.user?.firstName || "Admin",
    };

    let sub = await Subscription.findOne({ franchise: franchiseId });

    if (sub) {
      histEntry.previousEndDate = sub.endDate;
      sub.plan = plan;
      sub.startDate = start;
      sub.endDate = end;
      sub.status = "ACTIVE";
      sub.notes = notes || sub.notes;
      sub.paymentHistory.push(histEntry);
      await sub.save();
    } else {
      sub = await Subscription.create({
        franchise: franchiseId,
        franchiseName: franchise.franchiseName,
        franchiseCode: franchise.franchiseId,
        ownerName: franchise.ownerName,
        contact: franchise.contact,
        plan,
        startDate: start,
        endDate: end,
        status: "ACTIVE",
        notes: notes || "",
        paymentHistory: [histEntry],
      });
    }

    res.status(200).json({ message: "Subscription enabled successfully", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// EXTEND  (admin)
// ─────────────────────────────────────────────────
exports.extend = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const { plan, customDays, amount, notes } = req.body;

    let daysAdded = 0;
    let planLabel = "";

    if (plan && PLAN_DAYS[plan]) {
      daysAdded = PLAN_DAYS[plan];
      planLabel = plan;
    } else if (customDays && Number(customDays) > 0) {
      daysAdded = Number(customDays);
      planLabel = `${daysAdded} days (custom)`;
    } else {
      return res.status(400).json({ message: "Provide a valid plan or custom days" });
    }

    const sub = await Subscription.findOne({ franchise: franchiseId });
    if (!sub) return res.status(404).json({ message: "No subscription found. Enable it first." });

    const previousEndDate = new Date(sub.endDate);
    const extendFrom = sub.endDate > new Date() ? new Date(sub.endDate) : new Date();
    const newEndDate = new Date(extendFrom);
    newEndDate.setDate(newEndDate.getDate() + daysAdded);

    sub.endDate = newEndDate;
    sub.status = "ACTIVE";
    if (plan) sub.plan = plan;

    sub.paymentHistory.push({
      receiptNo: genReceiptNo(),
      amount: Number(amount) || 0,
      plan: planLabel,
      daysAdded,
      previousEndDate,
      newEndDate,
      paidAt: new Date(),
      notes: notes || "",
      createdBy: req.user?.firstName || "Admin",
    });

    await sub.save();
    res.status(200).json({ message: "Subscription extended successfully", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// SUSPEND  (admin)
// ─────────────────────────────────────────────────
exports.suspend = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ franchise: req.params.franchiseId });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    sub.status = "SUSPENDED";
    await sub.save();
    res.status(200).json({ message: "Subscription suspended", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// CHECK (middleware helper — called from authMiddleware)
// ─────────────────────────────────────────────────
exports.checkActive = async (franchiseId) => {
  if (!franchiseId) return true; // admin users pass through
  await autoExpire();
  const sub = await Subscription.findOne({ franchise: franchiseId, isDeleted: false });
  if (!sub) return false;           // no subscription at all
  return sub.status === "ACTIVE";
};
