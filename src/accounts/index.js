const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const { uploadProfilePicture, deleteAccount } = require('./accountsController');
const multer = require('multer');
const { deleteAccountValidator } = require('./accountsValidator');
const upload = multer({ dest: 'src/accounts/tmp/uploads/' });
const validatorMiddleware = require('../../middleware/validator');
router.use(verifyUser);
router
  .route('/upload-profile-picture')
  .put(upload.single('profilePicture'), uploadProfilePicture);

router.delete(
  '/delete-account',
  validatorMiddleware(deleteAccountValidator),
  deleteAccount
);

module.exports = router;
