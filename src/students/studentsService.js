const accountService = require('../accounts/accountsService');

async function getStudents() {
  const students = await accountService.getStudents();

  return students;
}

async function getSingleStudent(id) {
  const student = await accountService.getSingleAccount(id);

  return student;
}

async function updateStudent({ id, payload }) {
  const student = await accountService.updateAccount({ id, payload });

  return student;
}

async function changeStudentPassword({ id, password }) {
  const student = await accountService.changeAccountPassword({ id, password });

  return student;
}

module.exports = {
  getStudents,
  getSingleStudent,
  updateStudent,
  changeStudentPassword,
};
