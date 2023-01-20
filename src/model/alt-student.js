const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AltStudentSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    track: { type: String, required: true },
    matric: { type: String, required: true },
  },
  { timestamps: true }
);

const AltStudent = mongoose.model('AltStudent', AltStudentSchema);

module.exports = AltStudent;
