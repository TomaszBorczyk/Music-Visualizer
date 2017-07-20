const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackSchema = new Schema(
  {
    name: { type: String },
    link: { type: String },
    created_date: { type: Date, default: Date.now }
  }
);

const TrackModel = mongoose.model('track', TrackSchema);

module.exports = TrackModel;
