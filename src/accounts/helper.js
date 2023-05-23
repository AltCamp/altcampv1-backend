const fs = require('fs');
const { imageValidator } = require('./accountsValidator');
const { BadRequestError } = require('../../utils/customError');

function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      return err;
    }
  });
}

function validateImageInput(reqBody, file) {
  if (Object.keys(reqBody).length > 0) {
    const error = new BadRequestError(
      'Invalid payload! Please send only an image file'
    );
    return error;
  }

  const { error } = imageValidator.validate(file);
  if (error) {
    return error;
  }
}

module.exports = {
  deleteFile,
  validateImageInput,
};
