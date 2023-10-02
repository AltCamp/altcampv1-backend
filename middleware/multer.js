const multer = require('multer');
const { uploadPath } = require('../config');
const { UnprocessableEntity } = require('../utils/customError');
const { VALID_IMAGE_FORMATS } = require('../constant');
const expectedMimeTypes = {
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'image/svg': true,
  'image/tiff': true,
  'image/webp': true,
};

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 4,
    fileSize: 1024 * 1024 * 4,
  },
  fileFilter: (req, file, cb) => {
    try {
      if (expectedMimeTypes[file.mimetype]) {
        cb(null, true);
      } else
        throw new UnprocessableEntity(
          `Please use a valid image format. Valid formats include: ${Object.values(
            VALID_IMAGE_FORMATS
          ).join(', ')}`
        );
    } catch (error) {
      cb(error);
    }
  },
});

module.exports = { upload };
