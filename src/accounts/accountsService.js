const { omit } = require('lodash');
const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryConfig } = require('../../config');
const { Account, ...Model } = require('../../model');
const {
  NotFoundError,
  UnAuthorizedError,
  BadRequestError,
} = require('../../utils/customError');
const {
  tokenExpires,
  validateCredentials,
  verifyPassword,
  generateId,
} = require('../../utils/helper');
const { apiFeatures } = require('../common');
const {
  TOKEN_TYPE,
  EMAIL_TEMPLATES,
  EMAIL_SUBJECTS,
  OTP_VALIDITY,
} = require('../../constant');
const mailService = require('../mailer/mailerService');
const TokenService = require('../token/tokenService');
cloudinary.config({
  cloud_name: cloudinaryConfig.name,
  api_key: cloudinaryConfig.key,
  api_secret: cloudinaryConfig.secret,
});

async function accountExists(email) {
  const account = await Account.findOne({ email });

  if (account) {
    return account;
  }

  return false;
}

async function updatePassword(userId, oldPassword, newPassword) {
  let user = await Account.findOne(userId).select('+password');

  const check = await verifyPassword(oldPassword, user.password);
  if (!check) {
    throw new UnAuthorizedError();
  }

  user.password = newPassword;
  await user.save();
  user = omit(user.toObject(), ['password']);
  return user;
}

const requestPasswordReset = async ({ email }) => {
  const validUser = await accountExists(email);
  if (!validUser) return;

  const requestId = generateId();
  const token = await TokenService.createToken({
    requestId,
    type: TOKEN_TYPE.PASSWORD_RESET,
    owner: validUser._id,
    timeToLive: OTP_VALIDITY.PASSWORD_RESET,
  });

  if (!token) throw new BadRequestError();

  const mailServicePayload = {
    context: {
      name: validUser.firstName,
      tokenValidity: tokenExpires(OTP_VALIDITY.PASSWORD_RESET),
      token,
    },
    email: validUser.email,
    templateName: EMAIL_TEMPLATES.PASSWORD_RESET,
    subject: EMAIL_SUBJECTS.PASSWORD_RESET,
  };

  await mailService.sendMail(mailServicePayload);
  return requestId;
};

const resetPassword = async ({
  requestId,
  token,
  retypePassword: newPassword,
}) => {
  const key = TOKEN_TYPE.PASSWORD_RESET + requestId;
  const userToken = await TokenService.getToken(key);

  if (!userToken || !userToken.token === token)
    throw new BadRequestError('Invalid token');

  let user = await Account.findById(userToken.owner).select('+password');
  if (!user) throw new BadRequestError('Invalid token');

  user.password = newPassword;
  await user.save();
  user = omit(user.toObject(), ['password']);

  TokenService.deleteToken(key);

  return user;
};

async function getAccounts({ query }) {
  const accountsQuery = Account.find({}).populate('owner');
  const accounts = await new apiFeatures(accountsQuery, query)
    .filter()
    .sort()
    .paginate();
  return accounts;
}

async function getSingleAccount(id) {
  const account = await Account.findById(id).populate('owner');

  return account;
}

async function updateAccount({ id, payload }) {
  const account = await Account.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('owner');

  return account;
}

async function deleteAccount({ id, password }) {
  try {
    let account = await Account.findById(id).populate('owner');
    if (!account) {
      throw new NotFoundError('Account not found!');
    }
    let deletedAccount = await validateCredentials(account.email, password);
    if (!deletedAccount) {
      throw new UnAuthorizedError('Incorrect Password!');
    }

    account.isDeleted = true;
    account.save();

    return account;
  } catch (error) {
    return error;
  }
}

async function createAccount({ category, altSchoolId, ...payload }) {
  const obj = (altSchoolId && { altSchoolId }) || {};
  const { _id: owner } = await Model[category].create(obj);
  const account = await Account.create({
    ...payload,
    owner,
    accountType: category,
  });
  await account.populate('owner');
  return account;
}

async function uploadProfilePicture({ id, image }) {
  try {
    const account = await Account.findById(id);
    if (!account) {
      const error = new NotFoundError('Account not found!');
      return error;
    }

    const cloudinaryUpload = await cloudinary.uploader.upload(image, {
      public_id: `${cloudinaryConfig.folder}/images/profile-pictures/${id}`,
    });

    account.profilePicture = cloudinaryUpload.secure_url;
    await account.save();

    return account;
  } catch (error) {
    return error;
  }
}

async function deleteProfilePicture(id) {
  try {
    const account = await Account.findById(id);
    if (!account) {
      const error = new NotFoundError('Account not found!');
      return error;
    }

    // eslint-disable-next-line no-unused-vars
    const cloudinaryUpload = await cloudinary.uploader.destroy(
      `${cloudinaryConfig.folder}/images/profile-pictures/${id}`
    );

    // delete profile picture from database
    account.profilePicture = '';
    await account.save();
  } catch (error) {
    return error;
  }
}

module.exports = {
  accountExists,
  createAccount,
  getAccounts,
  getSingleAccount,
  updateAccount,
  uploadProfilePicture,
  deleteProfilePicture,
  deleteAccount,
  updatePassword,
  requestPasswordReset,
  resetPassword,
};
