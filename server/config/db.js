const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI belum diisi di file .env');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB terhubung: ${mongoose.connection.name}`);
};

module.exports = connectDB;
