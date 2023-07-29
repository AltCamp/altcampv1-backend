const mongoose = require('mongoose');

const tracksSchema = new mongoose.Schema(
  {
    track: {
      type: String,
    },
  },
  { timestamps: true }
);

const Track = mongoose.model('Track', tracksSchema);

module.exports = Track;
