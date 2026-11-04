// seed.js
// Isi koleksi contents dengan 30 konten.
// No 1 sampai 20 langsung terbit (tanggal mundur ke belakang),
// no 21 sampai 30 terjadwal ke depan dengan selang 1 sampai 2 hari.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Content = require('./models/Content');
const contents = require('./data/contents.json');

const SATU_HARI = 24 * 60 * 60 * 1000;
const JUMLAH_TERBIT = 20;
// hari ke depan untuk konten terjadwal (no 21 sampai 30)
const JADWAL = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14];

const jamPagi = (date) => {
  const d = new Date(date);
  d.setHours(7, 0, 0, 0);
  return d;
};

const hitungPublishedAt = (no) => {
  const sekarang = new Date();
  if (no <= JUMLAH_TERBIT) {
    // konten lama terbit lebih dulu, no 20 terbit kemarin
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
    data.filter((c) => c.publishedAt > new Date()).forEach((c) => {
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
