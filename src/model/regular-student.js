const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegularStudentSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = RegularStudent = mongoose.model("RegularStudent", RegularStudentSchema);