const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { hashPassword } = require('../../utils/authUtils');

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

const Mentor = mongoose.model('Mentor', MentorSchema);

module.exports = Mentor;
