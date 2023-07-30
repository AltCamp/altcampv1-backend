const { Track } = require('../../model');
const { TRACK_DETAILS } = require('../../constant');

/**
 * Tracks Service
 * @class TracksService
 */
class TracksService {
  /**
   * Retrieves a list of tracks from the database.
   *
   * @returns {Promise<{ id: string, track: string }[]>} A Promise that resolves to an array of track objects.
   */
  async getTracks() {
    return Track.find({}).select(Object.values(TRACK_DETAILS));
  }
}

module.exports = TracksService;
