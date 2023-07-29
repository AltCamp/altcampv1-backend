const { Track } = require('../../model');

const getTracks = async () => {
  const tracks = Track.find({});
  return tracks;
};

module.exports = { getTracks };
