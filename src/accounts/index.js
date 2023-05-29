const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const validatorMiddleware = require('../../middleware/validator');
const {
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
  uploadProfilePicture,
} = require('./accountsController');
const {
  getAccountsValidator,
  profileBioValidator,
  profileValidator,
  deleteAccountValidator,
  imageValidator,
} = require('./accountsValidator');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});

router
  .route('/')
  .get(validator.query(getAccountsValidator), getAccounts)
  .put(verifyUser, validatorMiddleware(profileValidator), updateAccount);

router
  .route('/bio')
  .put(verifyUser, validatorMiddleware(profileBioValidator), updateAccount);

router
  .route('/profile-picture')
  .post(verifyUser, validatorMiddleware(imageValidator), uploadProfilePicture)
  .put(verifyUser, validatorMiddleware(imageValidator), uploadProfilePicture);

router.route('/:id').get(getAccount);

router
  .route('/delete-account')
  .delete(
    verifyUser,
    validatorMiddleware(deleteAccountValidator),
    deleteAccount
  );

module.exports = router;
