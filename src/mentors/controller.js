async function createMentor(req, res) {
  // eslint-disable-next-line
  const { firstname, lastname, email, password } = req.body;
  if (!password) {
    return res.status(422).json({
      msg: 'You fucked up bro!',
    });
  }
  res.status(201).json({
    msg: 'User created successfully',
  });
}

module.exports = {
  createMentor,
};
