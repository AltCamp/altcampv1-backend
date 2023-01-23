const Student = require('../../model/student');

async function getStudents(req, res) {
  const students = await Student.find({});
  res.json(students);
}

module.exports = {
  getStudents,
};

// const registerNewAltStudent = async (req, res) => {
//   delete req.user.password;
//   return res.status(201).json({
//     message: 'AltStudent signup successful',
//     user: {
//       id: req.user._id,
//       name: `${req.user.firstname} ${req.user.lastname}`,
//       email: req.user.email,
//       createdAt: req.user.createdAt,
//     },
//   });
// };

// module.exports = {
//   registerNewAltStudent,
// };
