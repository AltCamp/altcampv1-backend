const accountService = require('../accounts/accountsService');

async function getMentors() {
  const mentors = await accountService.getMentors();

  return mentors;
}

async function getSingleMentor(id) {
  const mentor = await accountService.getSingleAccount(id);

  return mentor;
}

async function updateMentor({ id, payload }) {
  const mentor = await accountService.updateAccount({ id, payload });

  return mentor;
}

async function changeMentorPassword({ id, password }) {
  const mentor = await accountService.changeAccountPassword({ id, password });

  return mentor;
}

module.exports = {
  getMentors,
  getSingleMentor,
  updateMentor,
  changeMentorPassword,
};
