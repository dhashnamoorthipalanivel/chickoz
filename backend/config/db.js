const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server Connected Successfully");
  } catch (error) {
    console.error("Server Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;