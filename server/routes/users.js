const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// ubah target
router.put('/target', async (req, res, next) => {
  try {
    const target = Number(req.body.dailyTarget);
    if (!Number.isInteger(target) || target < 5 || target > 300) {
      return res.status(400).json({ message: 'Target harian harus 5 sampai 300 menit' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { dailyTarget: target },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Target harian diperbarui', dailyTarget: user.dailyTarget });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
