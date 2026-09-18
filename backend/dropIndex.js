const mongoose = require("mongoose");
require("dotenv").config();
const Customer = require("./models/customerModel");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    console.log("Connected to MongoDB");
    // Some mongo versions might throw if index doesn't exist, we catch it
    await Customer.collection.dropIndex("mobile_1");
    console.log("Dropped unique index 'mobile_1' successfully");
  } catch(e) {
    console.log("Error dropping index (it may not exist anymore):", e.message);
  }
  process.exit(0);
});
