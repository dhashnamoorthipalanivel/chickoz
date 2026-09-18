require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const f = await require('./models/masterModels/franchiseModel').findOne();
  const Table = require('./models/masterModels/tableModel');
  await Table.updateMany({}, { $set: { franchiseId: f._id } });
  console.log('Updated tables with franchise ID:', f._id);
  process.exit(0);
});
