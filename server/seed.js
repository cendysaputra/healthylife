// seed.js
// isi 30 konten
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Content = require('./models/Content');
const contents = require('./data/contents.json');

const SATU_HARI = 24 * 60 * 60 * 1000;
const JUMLAH_TERBIT = 20;
// jadwal terbit
const JADWAL = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14];

const jamPagi = (date) => {
  const d = new Date(date);
  d.setHours(7, 0, 0, 0);
  return d;
};

const hitungPublishedAt = (no) => {
  const sekarang = new Date();
  if (no <= JUMLAH_TERBIT) {
    // sudah terbit
    return jamPagi(sekarang.getTime() - (JUMLAH_TERBIT - no + 1) * SATU_HARI);
  }
  return jamPagi(sekarang.getTime() + JADWAL[no - JUMLAH_TERBIT - 1] * SATU_HARI);
};

const run = async () => {
  try {
    await connectDB();
    await Content.deleteMany({});

    const data = contents.map((c) => ({ ...c, publishedAt: hitungPublishedAt(c.no) }));
    await Content.insertMany(data);
    await Content.syncIndexes();

    const terbit = data.filter((c) => c.publishedAt <= new Date()).length;
    console.log(`Seed selesai: ${data.length} konten, ${terbit} sudah terbit, ${data.length - terbit} terjadwal.`);
    data
      .filter((c) => c.publishedAt > new Date())
      .forEach((c) => {
        console.log(`  ${c.publishedAt.toISOString().slice(0, 10)}  ${c.title}`);
      });
  } catch (err) {
    console.error('Seed gagal:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
