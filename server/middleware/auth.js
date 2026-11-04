// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// wajib login
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Akun tidak ditemukan' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Sesi tidak valid, silakan login ulang' });
  }
};

module.exports = auth;
