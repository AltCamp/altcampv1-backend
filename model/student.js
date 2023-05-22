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
  altSchoolId: {
    type: String,
    unique: true,
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
