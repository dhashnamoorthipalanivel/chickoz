const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB().then(async () => {
  try {
    const mongoose = require("mongoose");
    const db = mongoose.connection;
    const indexDrops = [
      { col: "packages",    idx: "packageCode_1"    },
      { col: "taxes",       idx: "taxCode_1"        },
      { col: "masalaitems", idx: "itemCode_1"        },
      { col: "paymentmodes",idx: "paymentCode_1"    },
      { col: "ordertypes",  idx: "orderTypeCode_1"  },
      { col: "leadsources", idx: "leadSourceCode_1" },
      { col: "documents",   idx: "documentCode_1"   },
      { col: "materials",   idx: "materialCode_1"   },
      { col: "menus",       idx: "menuCode_1"       },
    ];
    for (const { col, idx } of indexDrops) {
      try {
        await db.collection(col).dropIndex(idx);
        console.log(`[migration] Dropped index ${idx} on ${col}`);
      } catch (_) {}
    }
  } catch (err) {
    console.error("[migration] index drop:", err.message);
  }
});

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Auth
app.use("/api/auth", require("./routes/authRoutes"));

// Master
app.use("/api/packages", require("./routes/masterRoutes/packageRoutes"));
app.use("/api/taxes", require("./routes/masterRoutes/taxRoutes"));
app.use("/api/masalaItems", require("./routes/masterRoutes/masalaItemsRoutes"));
app.use("/api/paymentModes", require("./routes/masterRoutes/paymentModeRoutes"));
app.use("/api/orderTypes", require("./routes/masterRoutes/orderTypeRoutes"));
app.use("/api/leadSources", require("./routes/masterRoutes/leadSourceRoutes"));
app.use("/api/materials",  require("./routes/masterRoutes/materialRoutes"));
app.use("/api/documents", require("./routes/masterRoutes/documentRoutes"));
app.use("/api/franchises", require("./routes/masterRoutes/franchiseRoutes"));
app.use("/api/franchise-menu", require("./routes/masterRoutes/franchiseMenuRoutes"));
app.use("/api/menus", require("./routes/masterRoutes/menu/menuItemRoutes"));

// CRM
app.use("/api/enquiry", require("./routes/enquiryRoutes"));
app.use("/api/lead", require("./routes/leadRoutes"));
app.use("/api/kishok", require("./routes/kishokRoutes"));
app.use("/api/masala-request", require("./routes/masalaRequestRoutes"));

// Subscription
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

// Notifications
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Dashboard
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Reports
app.use("/api/reports", require("./routes/reportRoutes"));

// Orders
app.use("/api/orders", require("./routes/orderRoutes"));

// Customer
app.use("/api/customers", require("./routes/customerRoutes"));

// Serve React frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Global express error handler — catches ECONNRESET when client closes early
app.use((err, req, res, next) => {
  if (err.code === "ECONNRESET" || err.code === "EPIPE") return;
  console.error("Express error:", err.message);
  if (!res.headersSent) res.status(500).json({ message: err.message });
});

process.on("uncaughtException", (err) => {
  if (err.code === "ECONNRESET" || err.code === "EPIPE") return;
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  if (err?.code === "ECONNRESET" || err?.code === "EPIPE") return;
  console.error("UNHANDLED REJECTION:", err);
});
