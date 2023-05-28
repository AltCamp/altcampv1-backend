const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const { imageValidator } = require('../accounts/accountsValidator');
const { uploadProfilePicture } = require('./accountsController');

router.use(verifyUser);
router
  .route('/profile-picture')
  .post(validatorMiddleware(imageValidator), uploadProfilePicture);

module.exports = router;
