// models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['jalan', 'lari', 'bersepeda', 'gym', 'yoga', 'peregangan', 'lainnya'],
    required: true
  },
  duration: { type: Number, required: true, min: 1, max: 600 }, // menit
  calories: { type: Number, min: 0, default: null },
  note: { type: String, trim: true, maxlength: 200 },
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

ActivitySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);
