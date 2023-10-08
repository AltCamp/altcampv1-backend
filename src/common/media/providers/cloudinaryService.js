const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryConfig } = require('../../../../config');
const { Media } = require('../../../../model');
const MediaService = require('.');
const { MEDIA_TYPE } = require('../../../../constant');

cloudinary.config({
  cloud_name: cloudinaryConfig.name,
  api_key: cloudinaryConfig.key,
  api_secret: cloudinaryConfig.secret,
  secure: true,
});

class CloudinaryService extends MediaService {
  async uploadMedia({ media, type, owner, filename, isProfilePhoto }) {
    const options = {
      resource_type: type,
      public_id: `${cloudinaryConfig.folder}/${owner}/media/${
        isProfilePhoto ? 'profilePhoto/' : ''
      }${filename}`,
      asset_folder: `${owner}`,
    };

    return await cloudinary.uploader.upload(media, options);
  }

  async saveMedia(
    { media, owner, type = MEDIA_TYPE.IMAGE },
    session = null,
    isProfilePhoto = false
  ) {
    const { url, asset_id: assetId } = await this.uploadMedia({
      media: media.path,
      type,
      owner,
      filename: media.filename,
      isProfilePhoto,
    });

    const [mediaInDb] = await Media.create(
      [
        {
          url,
          type,
          owner,
          assetId,
        },
      ],
      { session }
    );

    return mediaInDb;
  }
}

module.exports = CloudinaryService;
