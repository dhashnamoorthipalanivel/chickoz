const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chickoz');
  const Sub = mongoose.model('Subscription', new mongoose.Schema({}, { strict: false }));
  
  const now = new Date();
  const res = await Sub.updateMany(
    { startDate: { $lte: now }, status: 'UPCOMING' },
    { status: 'ACTIVE' }
  );
  console.log('Activated UPCOMING subscriptions:', res);
  
  const sathya = await Sub.findOne({ franchiseName: /Sathya/i });
  console.log('Sathya Chickroz Subscription Status:', sathya);
  
  await mongoose.disconnect();
}

run().catch(console.error);
