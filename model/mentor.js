const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/authUtils');

const Schema = mongoose.Schema;

const MentorSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    track: { type: String, required: true },
  },
  { timestamps: true }
);

MentorSchema.pre('save', async function (next) {
  const user = this;
  try {
    if (user.isModified('password') || user.isNew) {
      await hashPassword(user);
    }
    next();
  } catch (error) {
    next(error);
  }
});

MentorSchema.methods.isValidPassword = async function (password) {
  const user = this;
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.log(error);
  }
};

const Mentor = mongoose.model('Mentor', MentorSchema);

module.exports = Mentor;
