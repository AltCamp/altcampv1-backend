const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const {
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
  deleteProfilePicture,
  updatePassword,
  forgotPassword,
  resetPassword,
  validatePasswordResetOtp,
  addProfilePicture,
} = require('./accountsController');
const {
  getAccountsValidator,
  profileBioValidator,
  profileValidator,
  deleteAccountValidator,
  imageValidator,
  passwordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  validateTokenValidator,
} = require('./accountsValidator');
const validator = require('../common/validator');
const { upload } = require('../../middleware/multer');

router
  .route('/')
  .get(validator.query(getAccountsValidator), getAccounts)
  .put(verifyUser, validatorMiddleware(profileValidator), updateAccount);

router
  .route('/bio')
  .put(verifyUser, validatorMiddleware(profileBioValidator), updateAccount);

router
  .route('/profile-picture')
  .put(verifyUser, validatorMiddleware(imageValidator), uploadProfilePicture)
  .post(verifyUser, upload.single('profilePicture'), addProfilePicture)
  .delete(verifyUser, deleteProfilePicture);

router.route('/:id').get(getAccount);

router
  .route('/delete-account')
  .delete(
    verifyUser,
    validatorMiddleware(deleteAccountValidator),
    deleteAccount
  );

router
  .route('/update-password')
  .put(verifyUser, validatorMiddleware(passwordValidator), updatePassword);

router
  .route('/forgot-password')
  .post(validatorMiddleware(forgotPasswordValidator), forgotPassword);

router
  .route('/verify-password-reset-otp')
  .post(validatorMiddleware(validateTokenValidator), validatePasswordResetOtp);

router
  .route('/reset-password')
  .post(validatorMiddleware(resetPasswordValidator), resetPassword);

module.exports = router;
