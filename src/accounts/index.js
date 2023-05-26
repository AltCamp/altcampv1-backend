const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const multer = require('multer');
const { deleteAccountValidator } = require('./accountsValidator');
const upload = multer({ dest: 'src/accounts/tmp/uploads/' });
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
  .route('/upload-profile-picture')
  .put(verifyUser, upload.single('profilePicture'), uploadProfilePicture);

router.route('/:id').get(getAccount);

router
  .route('/delete-account')
  .delete(
    verifyUser,
    validatorMiddleware(deleteAccountValidator),
    deleteAccount
  );

module.exports = router;
