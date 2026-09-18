const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const Order = require('./models/orderModel');
    const orders = await Order.find({ orderNumber: { $regex: "REF017-001" } }).select('orderNumber franchiseId createdAt');
    console.log("Orders around 0014:");
    orders.forEach(o => console.log(`${o.orderNumber} - franchise: ${o.franchiseId} - createdAt: ${o.createdAt}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
