const express = require('express');
const Content = require('../models/Content');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// konten baru
router.get('/', async (req, res, next) => {
  try {
    const items = await Content.find({
      publishedAt: { $gt: req.user.lastSeenAt, $lte: new Date() }
    })
      .select('title slug category thumbnail publishedAt')
      .sort({ publishedAt: -1 })
      .limit(20);

    res.json({ count: items.length, items, lastSeenAt: req.user.lastSeenAt });
  } catch (err) {
    next(err);
  }
});

// tandai dilihat
router.put('/seen', async (req, res, next) => {
  try {
    const now = new Date();
    await User.updateOne({ _id: req.user._id }, { lastSeenAt: now });
    res.json({ message: 'Notifikasi ditandai sudah dilihat', lastSeenAt: now });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
