const router = require('express').Router();
const { verifyUser } = require('../../middleware/authenticate');
const { uploadProfilePicture } = require('./accountsController');
const multer = require('multer');

const upload = multer({ dest: 'src/accounts/tmp/uploads/' });

router
  .route('/')
  .get((req, res) => {
    res.json({
      message: 'Here are all accounts',
    });
  })
  .put(verifyUser, (req, res) => {
    res.json({
      message: 'Update this account',
    });
  });

router.route('/bio').put(verifyUser, (req, res) => {
  res.json({
    message: 'Update bio',
  });
});
router.route('/password').put(verifyUser, (req, res) => {
  res.json({
    message: 'Password update',
  });
});
router
  .route('/upload-profile-picture')
  .put(verifyUser, upload.single('profilePicture'), uploadProfilePicture);

router.route('/:id').get((req, res) => {
  res.json({
    message: 'Here is a single account',
  });
});

module.exports = router;
