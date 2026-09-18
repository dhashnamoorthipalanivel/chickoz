const mongoose = require("mongoose");
const RawLead = require("./models/rawLeadModel");

const dummyData = [
  {
    name: "John Smith",
    phone: "9876543210",
    email: "john@example.com",
    platform: "FACEBOOK",
    campaignName: "Diwali Promo 2026",
    status: "PENDING"
  },
  {
    name: "Sarah Connor",
    phone: "8765432109",
    email: "sarah@example.com",
    platform: "GOOGLE",
    campaignName: "Search Network Generic",
    status: "PENDING"
  },
  {
    name: "Ali Khan",
    phone: "7654321098",
    email: "",
    platform: "INSTAGRAM",
    campaignName: "Story Ad",
    status: "PENDING"
  }
];

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");
    await RawLead.deleteMany({});
    await RawLead.insertMany(dummyData);
    console.log("Inserted dummy raw leads");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
