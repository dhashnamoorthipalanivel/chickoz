const Order         = require("../models/orderModel");
const Franchise     = require("../models/masterModels/franchiseModel");
const MasalaRequest = require("../models/masalaRequestModel");
const Enquiry       = require("../models/enquiryModel");
const Lead          = require("../models/leadModel");

/* ─── helpers ─────────────────────────────────────────────────────── */
const dayBounds = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  const start = new Date(d); start.setHours(0, 0, 0, 0);
  const end   = new Date(d); end.setHours(23, 59, 59, 999);
  return { start, end };
};

const sumAmount = (arr) => arr.reduce((s, o) => s + (o.totalAmount || 0), 0);

const growthPct = (curr, prev) =>
  prev === 0 ? (curr > 0 ? 100 : 0) : +((( curr - prev) / prev) * 100).toFixed(1);

const countBy = (arr, field, values) => {
  const m = {};
  values.forEach(v => { m[v] = 0; });
  arr.forEach(item => { const v = item[field]; if (v in m) m[v]++; });
  return m;
};

const buildSalesChart = (orders) => {
  const chart = [];
  for (let i = 6; i >= 0; i--) {
    const { start: twS, end: twE } = dayBounds(i);
    const { start: lwS, end: lwE } = { start: dayBounds(i + 7).start, end: dayBounds(i + 7).end };
    const tw = orders.filter(o => { const d = new Date(o.createdAt); return d >= twS && d <= twE; });
    const lw = orders.filter(o => { const d = new Date(o.createdAt); return d >= lwS && d <= lwE; });
    chart.push({
      day:      twS.toLocaleDateString("en-IN", { weekday: "short" }),
      thisWeek: sumAmount(tw),
      lastWeek: sumAmount(lw),
    });
  }
  return chart;
};

/* ══════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD  —  enquiry / lead / franchise / masala focused
══════════════════════════════════════════════════════════════════ */
exports.getAdminDashboard = async (req, res) => {
  try {
    const { start: todayStart, end: todayEnd } = dayBounds(0);
    const { start: yestStart,  end: yestEnd  } = dayBounds(1);

    const [
      enquiries, leads, franchises, masalaRequests,
    ] = await Promise.all([
      Enquiry.find({ isDeleted: false }).lean(),
      Lead.find({ isDeleted: false }).lean(),
      Franchise.find({ isDeleted: false }).lean(),
      MasalaRequest.find({}).lean(),
    ]);

    /* ── Enquiry stats ── */
    const enqStatus = countBy(enquiries, "status", ["NEW", "FOLLOW_UP", "HOLD", "CANCELLED", "CONVERTED_TO_LEAD"]);
    const todayEnq  = enquiries.filter(e => { const d = new Date(e.createdAt); return d >= todayStart && d <= todayEnd; });
    const yestEnq   = enquiries.filter(e => { const d = new Date(e.createdAt); return d >= yestStart  && d <= yestEnd;  });
    const recentEnquiries = [...enquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    /* ── Lead stats ── */
    const leadStatus = countBy(leads, "leadStatus", ["NEW", "IN_PROGRESS", "HOLD", "CANCELLED", "RETURN", "COMPLETED"]);
    const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    /* ── Franchise stats ── */
    const franStatus = countBy(franchises, "status", ["ACTIVE", "UNDER_MAINTENANCE", "INACTIVE", "CLOSED"]);
    const franchiseList = [...franchises].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    /* ── Masala request stats ── */
    const masalaStatus = countBy(masalaRequests, "status", [
      "REQUESTED", "UNDER_REVIEW", "APPROVED", "PROCESSING", "DISPATCHED", "DELIVERED", "REJECTED", "CANCELLED",
    ]);
    const recentMasala = [...masalaRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    res.json({
      stats: {
        totalEnquiries:    enquiries.length,
        newEnquiries:      enqStatus.NEW,
        convertedEnquiries: enqStatus.CONVERTED_TO_LEAD,
        todayEnquiries:    todayEnq.length,
        enquiryGrowth:     growthPct(todayEnq.length, yestEnq.length),

        totalLeads:        leads.length,
        newLeads:          leadStatus.NEW,
        completedLeads:    leadStatus.COMPLETED,
        inProgressLeads:   leadStatus.IN_PROGRESS,

        totalFranchises:   franchises.length,
        activeFranchises:  franStatus.ACTIVE,
        inactiveFranchises: franStatus.INACTIVE + franStatus.CLOSED,

        totalMasala:       masalaRequests.length,
        pendingMasala:     masalaStatus.REQUESTED,
        dispatchedMasala:  masalaStatus.DISPATCHED,
        deliveredMasala:   masalaStatus.DELIVERED,
      },
      enquiryStatus:  enqStatus,
      leadStatus:     leadStatus,
      franchiseStatus: franStatus,
      masalaStatus:   masalaStatus,
      recentEnquiries,
      recentLeads,
      franchiseList,
      recentMasala,
    });
  } catch (err) {
    console.error("Admin dashboard:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════════
   FRANCHISE DASHBOARD  —  orders / billing / masala (per franchise)
   Admin can pass ?franchiseId=<objectId>  to view any franchise
══════════════════════════════════════════════════════════════════ */
exports.getFranchiseDashboard = async (req, res) => {
  try {
    const fid = req.query.franchiseId || req.user?.franchiseId;
    if (!fid) return res.status(400).json({ message: "Franchise ID required" });

    const franchise = await Franchise.findById(fid).lean();
    if (!franchise) return res.status(404).json({ message: "Franchise not found" });

    const { start: todayS, end: todayE } = dayBounds(0);
    const { start: yestS,  end: yestE  } = dayBounds(1);
    const { start: twS }                  = dayBounds(6);
    const { start: lwS,    end: lwE }     = { start: dayBounds(13).start, end: dayBounds(7).end };

    const [allOrders, pendingMasala, totalMasala] = await Promise.all([
      Order.find({ franchiseId: fid }).lean(),
      MasalaRequest.countDocuments({ "franchise.franchiseId": franchise.franchiseId, status: "REQUESTED" }),
      MasalaRequest.countDocuments({ "franchise.franchiseId": franchise.franchiseId }),
    ]);

    const totalRevenue  = sumAmount(allOrders);
    const totalOrders   = allOrders.length;
    const avgOrder      = totalOrders ? +(totalRevenue / totalOrders).toFixed(2) : 0;

    const todayOrd  = allOrders.filter(o => { const d = new Date(o.createdAt); return d >= todayS && d <= todayE; });
    const yestOrd   = allOrders.filter(o => { const d = new Date(o.createdAt); return d >= yestS  && d <= yestE;  });
    const twOrd     = allOrders.filter(o => new Date(o.createdAt) >= twS);
    const lwOrd     = allOrders.filter(o => { const d = new Date(o.createdAt); return d >= lwS && d <= lwE; });

    const todayRevenue = sumAmount(todayOrd);
    const twRevenue    = sumAmount(twOrd);
    const lwRevenue    = sumAmount(lwOrd);

    /* order status */
    const orderStatus = countBy(allOrders, "orderStatus", ["PENDING", "PREPARING", "COMPLETED", "CANCELLED"]);
    const orderType   = countBy(allOrders, "orderType",   ["DINE_IN", "TAKE_AWAY", "HOME_DELIVERY"]);

    /* payment breakdown */
    const paymentBreakdown = { CASH: 0, UPI: 0, CARD: 0, WALLET: 0, OTHER: 0 };
    allOrders.forEach(o => { if (o.paymentMethod in paymentBreakdown) paymentBreakdown[o.paymentMethod] += (o.totalAmount || 0); });

    /* top items */
    const itemMap = {};
    allOrders.forEach(o => {
      (o.items || []).forEach(item => {
        if (!itemMap[item.menuName]) itemMap[item.menuName] = { name: item.menuName, qty: 0, revenue: 0 };
        itemMap[item.menuName].qty     += (item.qty || 1);
        itemMap[item.menuName].revenue += (item.finalPrice || 0);
      });
    });
    const topItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    const recentOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

    res.json({
      franchise,
      stats: {
        totalRevenue, totalOrders, avgOrder,
        todayRevenue, todayOrders: todayOrd.length,
        pendingMasala, totalMasala,
        growth: {
          orders:  growthPct(todayOrd.length, yestOrd.length),
          revenue: growthPct(todayRevenue, sumAmount(yestOrd)),
        },
      },
      weekComparison: { thisWeek: twRevenue, lastWeek: lwRevenue, growth: growthPct(twRevenue, lwRevenue) },
      salesChart:       buildSalesChart(allOrders),
      orderStatus,
      orderType,
      paymentBreakdown,
      topItems,
      recentOrders,
    });
  } catch (err) {
    console.error("Franchise dashboard:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ── Franchise list for admin filter dropdown ─────────────────────── */
exports.getFranchiseList = async (req, res) => {
  try {
    const list = await Franchise.find({ isDeleted: false })
      .select("_id franchiseId franchiseName ownerName status location")
      .sort({ franchiseName: 1 })
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
