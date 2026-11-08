require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// middleware umum
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// file thumbnail
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// cek server
app.get('/', (req, res) => {
  res.json({ name: 'HealthyLife API', status: 'ok', version: 'v1' });
});

// route API
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/contents', require('./routes/contents'));
app.use('/api/v1/favorites', require('./routes/favorites'));
app.use('/api/v1/activities', require('./routes/activities'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/users', require('./routes/users'));

// route tidak ada
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` });
});

// penanganan error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal konek database:', err.message);
    process.exit(1);
  });
