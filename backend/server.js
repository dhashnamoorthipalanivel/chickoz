const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");   // ADD THIS

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("EMAIL_USER:", process.env.EMAIL_USER);

connectDB();

const app = express();

// middleware
app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
}));

// routes
// authentication
app.use("/api/auth", require("./routes/authRoutes"));

// master
app.use("/api/packages", require("./routes/masterRoutes/packageRoutes"));
app.use("/api/taxes", require("./routes/masterRoutes/taxRoutes"));
app.use("/api/masalaItems", require("./routes/masterRoutes/masalaItemsRoutes"));
app.use("/api/paymentModes", require("./routes/masterRoutes/paymentModeRoutes"));
app.use("/api/orderTypes", require("./routes/masterRoutes/orderTypeRoutes"));
app.use("/api/leadSources", require("./routes/masterRoutes/leadSourceRoutes"));
app.use("/api/documents", require("./routes/masterRoutes/documentRoutes"));
app.use("/api/franchises", require("./routes/masterRoutes/franchiseRoutes"));
app.use("/api/franchise-menu", require("./routes/masterRoutes/franchiseMenuRoutes"))

// Menu item
app.use("/api/menus", require("./routes/masterRoutes/menu/menuItemRoutes"));

// CRM
app.use("/api/enquiry", require("./routes/enquiryRoutes"))
app.use("/api/lead", require("./routes/leadRoutes"))
app.use("/api/kishok", require("./routes/kishokRoutes"));
app.use("/api/masala-request", require("./routes/masalaRequestRoutes"));

// Customer 
app.use("/api/customers", require("./routes/customerRoutes"));

/* ===============================
   SERVE REACT FRONTEND (ADD THIS)
================================= */

const __dirnamePath = path.resolve();

app.use(express.static(path.join(__dirnamePath, "public")));

// app.use((req, res) => {
//   res.sendFile(path.join(__dirnamePath, "public", "index.html"));
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnamePath, "public", "index.html"));
});

/* =============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});