const { MediaProviders } = require('../../../constant');
const { NotAcceptableException } = require('../../../utils/customError');
const CloudinaryService = require('./providers/cloudinaryService');

class MediaServiceFactory {
  static getService(serviceProvider = MediaProviders.CLOUDINARY) {
    switch (serviceProvider) {
      case MediaProviders.CLOUDINARY: {
        return new CloudinaryService();
      }

      default:
        throw new NotAcceptableException('Provider not set up!');
    }
  }
}

module.exports = MediaServiceFactory;
