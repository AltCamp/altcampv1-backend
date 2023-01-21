const JWT = require('jsonwebtoken');
const CONFIG = require('../../config');
// const MentorSchema = require('../model/mentor');
const StudentSchema = require('../model/regular-student');
// const AltStudentSchema = require('../model/alt-student');

const signup = async (req, res) => {
  const { firstname, lastname, email, password, track } = req.body;

  try {
    const newUser = await StudentSchema.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      track: track,
    });

    delete newUser.password;

    return res
      .status(201)
      .json({ message: 'Student signup successful', user: newUser });
  } catch (error) {
    console.log(`error signup: ${error}`);
  }
};

const login = (req, res, { err, user, info }) => {
  if (err || !user) {
    return res.status(401).json({ message: err.message || info.message });
  }

  req.login(user, { session: false }, async (error) => {
    if (error) return res.status(401).json({ message: error.message });

    const body = { _id: user._id, email: user.email };

    const token = JWT.sign({ user: body }, CONFIG.jwt.secret, {
      expiresIn: CONFIG.jwt.expiry,
    });

    return res.status(200).json({ message: 'Student login successful', token });
  });
};

module.exports = {
  signup,
  login,
};
