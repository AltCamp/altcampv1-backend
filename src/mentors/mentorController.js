const mentorSchema = require('../model/mentor');

const registerNewMentor = async (req, res) => {
  const { firstname, lastname, email, password, track } = req.body;

  try {
    const newMentor = await mentorSchema.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      track: track,
    });

    delete newMentor.password;

    return res
      .status(201)
      .json({ message: 'Mentor signup successful', user: newMentor });
  } catch (error) {
    console.log(`error signup: ${error}`);
  }
};

module.exports = {
  registerNewMentor,
};