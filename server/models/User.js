const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    dailyTarget: { type: Number, default: 30, min: 5, max: 300 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    lastSeenAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
