const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MentorSchema = new Schema({
  specialization: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },
});

const Mentor = mongoose.model('Mentor', MentorSchema);

module.exports = Mentor;
