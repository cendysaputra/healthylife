const express = require('express');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { awalHariWIB, tanggalWIB, SATU_HARI } = require('../utils/date');

const router = express.Router();
router.use(auth);

const JENIS = ['jalan', 'lari', 'bersepeda', 'gym', 'yoga', 'peregangan', 'lainnya'];

// ringkasan harian
router.get('/summary', async (req, res, next) => {
  try {
    const hariIni = awalHariWIB();
    const mulai = new Date(hariIni.getTime() - 6 * SATU_HARI);
    const akhir = new Date(hariIni.getTime() + SATU_HARI);

    const list = await Activity.find({
      user: req.user._id,
      date: { $gte: mulai, $lt: akhir }
    });

    // siapkan 7 hari
    const perHari = [];
    for (let i = 0; i < 7; i++) {
      const tgl = new Date(mulai.getTime() + i * SATU_HARI);
      perHari.push({ date: tanggalWIB(tgl), minutes: 0 });
    }
    list.forEach((a) => {
      const slot = perHari.find((h) => h.date === tanggalWIB(a.date));
      if (slot) slot.minutes += a.duration;
    });

    const today = perHari[6].minutes;
    const target = req.user.dailyTarget;

    res.json({
      today,
      target,
      remaining: Math.max(target - today, 0),
      percent: Math.min(Math.round((today / target) * 100), 100),
      week: perHari
    });
  } catch (err) {
    next(err);
  }
});

// riwayat aktivitas
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const items = await Activity.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(limit);
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// catat aktivitas
router.post('/', async (req, res, next) => {
  try {
    const { type, duration, calories, note, date } = req.body;

    if (!JENIS.includes(type)) {
      return res.status(400).json({ message: `Jenis aktivitas harus salah satu dari: ${JENIS.join(', ')}` });
    }
    const durasi = Number(duration);
    if (!Number.isFinite(durasi) || durasi < 1 || durasi > 600) {
      return res.status(400).json({ message: 'Durasi harus 1 sampai 600 menit' });
    }

    let tanggal = new Date();
    if (date) {
      tanggal = new Date(date);
      if (Number.isNaN(tanggal.getTime())) {
        return res.status(400).json({ message: 'Format tanggal tidak valid' });
      }
      if (tanggal.getTime() > Date.now() + SATU_HARI) {
        return res.status(400).json({ message: 'Tanggal tidak boleh di masa depan' });
      }
    }

    const activity = await Activity.create({
      user: req.user._id,
      type,
      duration: durasi,
      calories: calories ? Number(calories) : null,
      note,
      date: tanggal
    });

    res.status(201).json({ activity });
  } catch (err) {
    next(err);
  }
});

// hapus aktivitas
router.delete('/:id', async (req, res, next) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!activity) {
      return res.status(404).json({ message: 'Aktivitas tidak ditemukan' });
    }
    res.json({ message: 'Aktivitas dihapus', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
