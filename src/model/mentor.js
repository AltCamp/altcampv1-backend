const mongoose = require('mongoose');

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

const Mentor = mongoose.model('Mentor', MentorSchema);

module.exports = Mentor;
