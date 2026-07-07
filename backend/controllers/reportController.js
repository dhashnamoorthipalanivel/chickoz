const Enquiry       = require("../models/enquiryModel");
const Lead          = require("../models/leadModel");
const Franchise     = require("../models/masterModels/franchiseModel");
const MasalaRequest = require("../models/masalaRequestModel");
const Order         = require("../models/orderModel");

/* ── helpers ─────────────────────────────────────────────────────── */
const dateRange = (from, to) => {
  const f = from ? new Date(from) : null;
  const t = to   ? new Date(to)   : null;
  if (t) t.setHours(23, 59, 59, 999);
  if (f && t) return { $gte: f, $lte: t };
  if (f)      return { $gte: f };
  if (t)      return { $lte: t };
  return null;
};

const franchiseFilter = (req) => {
  const isAdmin = ["admin", "super_admin"].includes(req.user?.role);
  if (isAdmin) return req.query.franchiseId || null;
  return req.user?.franchiseId || null;
};

/* ══════════════════════════════════════════════════════════════════
   ADMIN REPORTS
══════════════════════════════════════════════════════════════════ */

/* GET /api/reports/admin/enquiries */
exports.getEnquiryReport = async (req, res) => {
  try {
    const { from, to, status, search } = req.query;
    const filter = { isDeleted: false };
    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name:        { $regex: search, $options: "i" } },
      { phone:       { $regex: search, $options: "i" } },
      { place:       { $regex: search, $options: "i" } },
      { referenceId: { $regex: search, $options: "i" } },
    ];

    const rows = await Enquiry.find(filter)
      .populate("interestedPackage", "packageName")
      .populate("leadSource", "sourceName")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/admin/leads */
exports.getLeadReport = async (req, res) => {
  try {
    const { from, to, status, search } = req.query;
    const filter = { isDeleted: false };
    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;
    if (status) filter.leadStatus = status;
    if (search) filter.$or = [
      { name:        { $regex: search, $options: "i" } },
      { phone:       { $regex: search, $options: "i" } },
      { place:       { $regex: search, $options: "i" } },
      { referenceId: { $regex: search, $options: "i" } },
    ];

    const rows = await Lead.find(filter)
      .populate("interestedPackage", "packageName")
      .populate("leadSource", "sourceName")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/admin/franchises */
exports.getFranchiseReport = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (search) filter.$or = [
      { franchiseName: { $regex: search, $options: "i" } },
      { ownerName:     { $regex: search, $options: "i" } },
      { location:      { $regex: search, $options: "i" } },
      { franchiseId:   { $regex: search, $options: "i" } },
    ];

    const rows = await Franchise.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/admin/masala */
exports.getMasalaReport = async (req, res) => {
  try {
    const { from, to, status, franchiseId, search } = req.query;
    const filter = { isDeleted: false };
    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;
    if (status) filter.status = status;
    if (franchiseId) filter["franchise.franchiseId"] = franchiseId;
    if (search) filter.$or = [
      { requestId:              { $regex: search, $options: "i" } },
      { "franchise.franchiseName": { $regex: search, $options: "i" } },
    ];

    const rows = await MasalaRequest.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════════
   FRANCHISE REPORTS  (admin passes ?franchiseId=, franchise user uses JWT)
══════════════════════════════════════════════════════════════════ */

/* GET /api/reports/franchise/orders */
exports.getOrderReport = async (req, res) => {
  try {
    const { from, to, orderType, paymentMethod, orderStatus, search } = req.query;
    const fid = franchiseFilter(req);
    if (!fid) return res.status(400).json({ success: false, message: "Franchise required" });

    const filter = { franchiseId: fid };
    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;
    if (orderType)     filter.orderType     = orderType;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (orderStatus)   filter.orderStatus   = orderStatus;
    if (search) filter.$or = [
      { orderNumber:   { $regex: search, $options: "i" } },
      { customerName:  { $regex: search, $options: "i" } },
      { customerMobile:{ $regex: search, $options: "i" } },
    ];

    const rows = await Order.find(filter).sort({ createdAt: -1 }).lean();

    const summary = {
      totalOrders:  rows.length,
      totalRevenue: rows.reduce((s, r) => s + (r.totalAmount || 0), 0),
      totalTax:     rows.reduce((s, r) => s + (r.tax || 0), 0),
      totalDiscount:rows.reduce((s, r) => s + (r.discount || 0), 0),
    };

    res.json({ success: true, count: rows.length, summary, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/franchise/sales */
exports.getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fid = franchiseFilter(req);
    if (!fid) return res.status(400).json({ success: false, message: "Franchise required" });

    const filter = { franchiseId: fid, orderStatus: "COMPLETED" };
    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;

    const rows = await Order.find(filter).sort({ createdAt: 1 }).lean();

    /* Group by date */
    const byDate = {};
    rows.forEach(o => {
      const d = new Date(o.createdAt).toISOString().split("T")[0];
      if (!byDate[d]) byDate[d] = { date: d, orders: 0, revenue: 0, tax: 0, discount: 0 };
      byDate[d].orders++;
      byDate[d].revenue  += o.totalAmount || 0;
      byDate[d].tax      += o.tax         || 0;
      byDate[d].discount += o.discount    || 0;
    });

    const daily = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    const summary = {
      totalDays:    daily.length,
      totalOrders:  rows.length,
      totalRevenue: rows.reduce((s, r) => s + (r.totalAmount || 0), 0),
      avgPerDay:    daily.length ? (rows.reduce((s, r) => s + (r.totalAmount || 0), 0) / daily.length) : 0,
    };

    res.json({ success: true, summary, data: daily });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/franchise/masala */
exports.getFranchiseMasalaReport = async (req, res) => {
  try {
    const { from, to, status } = req.query;
    const isAdmin = ["admin", "super_admin"].includes(req.user?.role);
    const filter  = { isDeleted: false };

    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;
    if (status) filter.status = status;

    if (!isAdmin) {
      /* franchise user: filter by their franchiseId (stored in JWT) */
      const fid = req.user?.franchiseId;
      if (!fid) return res.status(400).json({ success: false, message: "Franchise not found" });
      filter["franchise.franchiseId"] = fid;
    } else if (req.query.franchiseId) {
      filter["franchise.franchiseId"] = req.query.franchiseId;
    }

    const rows = await MasalaRequest.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/franchise/items */
exports.getItemReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fid = franchiseFilter(req);
    if (!fid) return res.status(400).json({ success: false, message: "Franchise required" });

    const filter = { franchiseId: fid, orderStatus: "COMPLETED" };
    const dr = dateRange(from, to);
    if (dr) filter.createdAt = dr;

    const orders = await Order.find(filter, "items").lean();

    const itemMap = {};
    orders.forEach(o => {
      (o.items || []).forEach(it => {
        const k = it.menuId?.toString() || it.menuName;
        if (!itemMap[k]) itemMap[k] = { menuName: it.menuName, qty: 0, revenue: 0 };
        itemMap[k].qty     += it.qty        || 1;
        itemMap[k].revenue += it.finalPrice || 0;
      });
    });

    const data = Object.values(itemMap).sort((a, b) => b.qty - a.qty);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/reports/franchises-list  (admin dropdown) */
exports.getFranchiseList = async (req, res) => {
  try {
    const list = await Franchise.find({ isDeleted: false }, "franchiseId franchiseName ownerName location status").lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
