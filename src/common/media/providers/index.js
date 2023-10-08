class MediaService {
  async saveMedia() {
    throw new Error('Sub classes must implement UploadMedia');
  }
}

module.exports = MediaService;
