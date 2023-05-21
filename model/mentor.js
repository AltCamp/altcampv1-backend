const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mentorSchema = new Schema({
  specialization: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
