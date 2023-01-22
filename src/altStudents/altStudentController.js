const altStudentSchema = require('../model/alt-student');

const registerNewAltStudent = async (req, res) => {
  const { firstname, lastname, email, password, track, matric } = req.body;

  try {
    const newAltStudent = await altStudentSchema.create({
      firstname,
      lastname,
      email,
      password,
      track,
      matric,
    });

    delete newAltStudent.password;

    return res
      .status(201)
      .json({ message: 'AltStudent signup successful', user: newAltStudent });
  } catch (error) {
    console.log(`error signup: ${error}`);
  }
};

module.exports = {
  registerNewAltStudent,
};