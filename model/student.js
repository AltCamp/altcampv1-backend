const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  matric: {
    type: String,
  },
  stack: {
    type: String,
  },
  gender: {
    type: String,
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
