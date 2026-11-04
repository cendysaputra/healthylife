// routes/contents.js
const express = require('express');
const Content = require('../models/Content');

const router = express.Router();
const KATEGORI = ['artikel', 'video', 'olahraga', 'nutrisi'];

// amankan regex
const escapeRegex = (teks) => teks.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// daftar konten
router.get('/', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 30);

    const filter = {};
    if (category) {
      if (!KATEGORI.includes(category)) {
        return res.status(400).json({ message: 'Kategori tidak valid' });
      }
      filter.category = category;
    }
    if (q && q.trim()) {
      const pola = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ title: pola }, { summary: pola }, { tags: pola }];
    }

    const [items, total] = await Promise.all([
      Content.published(filter)
        .select('-body -sources')
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Content.countDocuments({ ...filter, publishedAt: { $lte: new Date() } })
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
});

// detail konten
router.get('/:slug', async (req, res, next) => {
  try {
    const content = await Content.published({ slug: req.params.slug }).findOne();
    if (!content) {
      return res.status(404).json({ message: 'Konten tidak ditemukan' });
    }

    // konten terkait
    const related = await Content.published({
      category: content.category,
      _id: { $ne: content._id }
    })
      .select('title slug category summary thumbnail publishedAt')
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json({ content, related });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
