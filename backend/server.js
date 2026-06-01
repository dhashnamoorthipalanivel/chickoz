// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const path = require("path");   // ADD THIS

// dotenv.config();
// console.log("SERVER STARTING...");

// // connectDB()

// const app = express();

// // middleware
// app.use(cors());

// app.use(express.json({ limit: "10mb" }));

// app.use(express.urlencoded({
//   extended: true,
//   limit: "10mb"
// }));

// // routes
// // authentication
// app.use("/api/auth", require("./routes/authRoutes"));

// // // master
// // app.use("/api/packages", require("./routes/masterRoutes/packageRoutes"));
// // app.use("/api/taxes", require("./routes/masterRoutes/taxRoutes"));
// // app.use("/api/masalaItems", require("./routes/masterRoutes/masalaItemsRoutes"));
// // app.use("/api/paymentModes", require("./routes/masterRoutes/paymentModeRoutes"));
// // app.use("/api/orderTypes", require("./routes/masterRoutes/orderTypeRoutes"));
// // app.use("/api/leadSources", require("./routes/masterRoutes/leadSourceRoutes"));
// // app.use("/api/documents", require("./routes/masterRoutes/documentRoutes"));
// // app.use("/api/franchises", require("./routes/masterRoutes/franchiseRoutes"));
// // app.use("/api/franchise-menu", require("./routes/masterRoutes/franchiseMenuRoutes"))

// // Menu item
// // app.use("/api/menus", require("./routes/masterRoutes/menu/menuItemRoutes"));

// // CRM
// // app.use("/api/enquiry", require("./routes/enquiryRoutes"))
// // app.use("/api/lead", require("./routes/leadRoutes"))
// // app.use("/api/kishok", require("./routes/kishokRoutes"));
// // app.use("/api/masala-request", require("./routes/masalaRequestRoutes"));

// // Customer 
// // app.use("/api/customers", require("./routes/customerRoutes"));

// /* ===============================
//    SERVE REACT FRONTEND (ADD THIS)
// ================================= */

// // const __dirnamePath = path.resolve();

// // app.use(express.static(path.join(__dirnamePath, "public")));

// // // app.use((req, res) => {
// // //   res.sendFile(path.join(__dirnamePath, "public", "index.html"));
// // // });

// // app.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirnamePath, "public", "index.html"));
// // });

// /* =============================== */

// const PORT = process.env.PORT || 3000;
// // const PORT = process.env.PORT;

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// app.get("/", (req, res) => {
//   res.send("Backend Running");
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });

// process.on("uncaughtException", (err) => {
//   console.error("UNCAUGHT EXCEPTION:", err);
// });

// process.on("unhandledRejection", (err) => {
//   console.error("UNHANDLED REJECTION:", err);
// });

require("dotenv").config();

console.log("STEP 1");

const express = require("express");
console.log("STEP 2");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend Running");
});

console.log("STEP 3");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});