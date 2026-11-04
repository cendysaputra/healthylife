// middleware/errorHandler.js

// error terpusat
const errorHandler = (err, req, res, next) => {
  // id tidak valid
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  // validasi mongoose
  if (err.name === 'ValidationError') {
    const pesan = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: pesan.join(', ') });
  }

  // data duplikat
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Data sudah terdaftar' });
  }

  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan di server' });
};

module.exports = errorHandler;
