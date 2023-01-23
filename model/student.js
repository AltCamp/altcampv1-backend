const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/authUtils');

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    track: { type: String, required: true },
    matric: { type: String },
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
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

studentSchema.methods.isValidPassword = async function (password) {
  const user = this;
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.log(error);
  }
};

const Student = mongoose.model('AltStudent', studentSchema);

module.exports = Student;
