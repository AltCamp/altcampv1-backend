const studentSchema = require('../model/regular-student');

const registerNewStudent = async (req, res) => {
  const { firstname, lastname, email, password, track } = req.body;

  try {
    const newStudent = await studentSchema.create({
      firstname,
      lastname,
      email,
      password,
      track,
    });

    delete newStudent.password;

    return res
      .status(201)
      .json({ message: 'Student signup successful', user: newStudent });
  } catch (error) {
    console.log(`error signup: ${error}`);
  }
};

module.exports = {
  registerNewStudent,
};