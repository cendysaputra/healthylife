// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// buat token
const buatToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// data aman
const dataUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  dailyTarget: user.dailyTarget,
  lastSeenAt: user.lastSeenAt,
  createdAt: user.createdAt
});

// daftar akun
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Format email tidak valid' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }

    const ada = await User.findOne({ email: email.toLowerCase() });
    if (ada) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ token: buatToken(user), user: dataUser(user) });
  } catch (err) {
    next(err);
  }
});

// masuk akun
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const cocok = await bcrypt.compare(password, user.password);
    if (!cocok) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({ token: buatToken(user), user: dataUser(user) });
  } catch (err) {
    next(err);
  }
});

// data akun
router.get('/me', auth, (req, res) => {
  res.json({ user: dataUser(req.user) });
});

module.exports = router;
