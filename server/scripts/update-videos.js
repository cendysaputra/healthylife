// isi link video
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Content = require('../models/Content');

// data video
const VIDEO = [
  { no: 12, videoUrl: 'https://www.youtube.com/watch?v=2uI8sZwQxSs' },
  { no: 18, videoUrl: 'https://www.youtube.com/watch?v=JFH2attWiMQ' },
  { no: 23, videoUrl: 'https://www.youtube.com/watch?v=IBLb-H5n2Uw' },
  { no: 24, videoUrl: 'https://www.youtube.com/watch?v=MaMdhtz4j9s' }
];

const run = async () => {
  try {
    await connectDB();

    for (const { no, videoUrl } of VIDEO) {
      const content = await Content.findOne({ no }).select('title');
      const hasil = await Content.updateOne({ no }, { $set: { videoUrl } });

      // nomor tidak ada
      if (hasil.matchedCount === 0) {
        console.warn(`  [PERINGATAN] Konten no. ${no} tidak ditemukan, dilewati.`);
        continue;
      }
      console.log(
        `  no. ${no}  ${content.title}  (matched: ${hasil.matchedCount}, modified: ${hasil.modifiedCount})`
      );
    }

    console.log('Update video selesai.');
  } catch (err) {
    console.error('Update video gagal:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
