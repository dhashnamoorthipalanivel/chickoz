const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
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
app.use("/api/orderTypes", require("./routes/masterRoutes/orderTypeRoutes"))
app.use("/api/leadSources", require("./routes/masterRoutes/leadSourceRoutes"))
app.use("/api/documents", require("./routes/masterRoutes/documentRoutes"))

// Menu item
app.use("/api/menus", require("./routes/masterRoutes/menu/menuItemRoutes")); 

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
