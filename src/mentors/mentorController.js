const registerNewMentor = async (req, res) => {
  delete req.user.password;
  return res.status(201).json({
    message: 'Mentor signup successful',
    user: {
      id: req.user._id,
      name: `${req.user.firstname} ${req.user.lastname}`,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports = {
  registerNewMentor,
};
