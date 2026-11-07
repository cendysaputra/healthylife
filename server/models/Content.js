// models/Content.js
const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema(
  {
    title: String,
    publisher: String,
    url: String
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema(
  {
    no: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['artikel', 'video', 'olahraga', 'nutrisi'],
      required: true
    },
    summary: { type: String, required: true },
    body: { type: String, required: true }, // markdown
    thumbnail: String,
    videoUrl: { type: String, default: null },
    readTime: Number,
    durationMinutes: { type: Number, default: null },
    level: { type: String, enum: ['pemula', 'menengah', null], default: null },
    tags: [String],
    sources: [SourceSchema],
    publishedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// index pencarian
ContentSchema.index({ title: 'text', summary: 'text', tags: 'text' });
ContentSchema.index({ category: 1, publishedAt: -1 });

// konten terbit
ContentSchema.statics.published = function (filter = {}) {
  return this.find({ ...filter, publishedAt: { $lte: new Date() } });
};

module.exports = mongoose.model('Content', ContentSchema);
