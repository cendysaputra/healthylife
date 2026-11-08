const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Content = require('../models/Content');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// daftar favorit
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      select: 'title slug category summary thumbnail publishedAt',
      match: { publishedAt: { $lte: new Date() } }
    });
    res.json({ items: user.favorites });
  } catch (err) {
    next(err);
  }
});

// tambah favorit
router.post('/:contentId', async (req, res, next) => {
  try {
    const { contentId } = req.params;
    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({ message: 'ID konten tidak valid' });
    }

    const content = await Content.published({ _id: contentId }).findOne();
    if (!content) {
      return res.status(404).json({ message: 'Konten tidak ditemukan' });
    }

    await User.updateOne({ _id: req.user._id }, { $addToSet: { favorites: content._id } });
    res.status(201).json({ message: 'Disimpan ke favorit', contentId });
  } catch (err) {
    next(err);
  }
});

// hapus favorit
router.delete('/:contentId', async (req, res, next) => {
  try {
    const { contentId } = req.params;
    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({ message: 'ID konten tidak valid' });
    }

    await User.updateOne({ _id: req.user._id }, { $pull: { favorites: contentId } });
    res.json({ message: 'Dihapus dari favorit', contentId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
