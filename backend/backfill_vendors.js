require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Vendor = require('./models/masterModels/vendorModel');
  const vendors = await Vendor.find({ $or: [{ vendorCode: { $exists: false } }, { vendorCode: null }] }).sort({ createdAt: 1 });
  
  let currentMax = 0;
  const allV = await Vendor.find({}, 'vendorCode');
  allV.forEach(v => {
    if (v.vendorCode && v.vendorCode.startsWith('VND')) {
      const num = parseInt(v.vendorCode.replace('VND', ''));
      if (!isNaN(num) && num > currentMax) currentMax = num;
    }
  });
  
  for (let v of vendors) {
    currentMax++;
    v.vendorCode = 'VND' + String(currentMax).padStart(3, '0');
    await v.save();
    console.log('Updated', v._id, 'with', v.vendorCode);
  }
  
  console.log('Done');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
