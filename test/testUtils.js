const { faker } = require('@faker-js/faker');
const { ACCOUNT_TYPES } = require('../constant');
const track = [
  'Frontend Engineering',
  'Backend Engineering',
  'Cloud Engineering',
  'Product Design',
  'Product Management',
  'Product Marketing',
  'Data Analysis',
  'Data Engineering',
  'Data Science',
];
const accountIds = [
  'f48bded06c714ab2db26afc4',
  'd7aebfdadd09c1db42abe3c4',
  'cf5eb0beed7ccf6aac8731df',
  'c5dfc38b35a8dda8abc311ab',
  '4bcebfd7489feca57be23aff',
];
const questionIds = [
  'f70c979585d37f3f9aebe3de',
  '21485ecedaef0d036bdc2df6',
  '3d94b658d7507bda7bb02c83',
  'f0bcdbcbfea5b580cb6984da',
  '7bb894b5e781903be51f2f68',
  'f4eff86ac1acbcee2de57dff',
  'a25397c3afcf1451ff72fbc7',
  'bab5e4b5b49691e3db8489b4',
  'c0fc763a9b3aa5e2bdc8b85c',
  'fdc0f999b4bb5950a659d9ca',
];

/**
 * Create a user.
 * @param {string} userType - The type of user to create.
 */
function createUser(userType) {
  const key = String(userType).toLowerCase();

  switch (key) {
    case 'admin':
      return { admin: 'admin' };
    case 'mentor':
      return createUserAsMentor();
    case 'student':
      return createUserAsStudent();
    default:
      return null;
  }
}

/**
 * Create a user as a mentor
 */
function createUserAsMentor() {
  const data = generateBioData();
  const mentor = createMentor();
  const account = {
    ...createAccount(data, mentor),
    accountType: ACCOUNT_TYPES.MENTOR,
  };

  return { account, user: mentor };
}

/**
 * Create a user as a student
 */
function createUserAsStudent() {
  const data = generateBioData();
  const student = createStudent(data);
  const account = {
    ...createAccount(data, student),
    accountType: ACCOUNT_TYPES.STUDENT,
  };

  return { account, user: student };
}

/**
 * Create a mentor entity
 */
function createMentor() {
  return {
    specialization: faker.helpers.arrayElement(track),
    yearsOfExperience: faker.random.numeric(),
    _id: faker.database.mongodbObjectId(),
  };
}

/**
 * Create a student entity
 * @param {{string}} {sex} - The sex of the student entity to create ({ sex: 'male' } || { sex: 'female' })
 */
function createStudent({ sex }) {
  return {
    _id: faker.database.mongodbObjectId(),
    matric: faker.datatype.uuid(),
    stack: faker.random.word(),
    gender: sex,
  };
}

/**
 * Create an account entity
 * @param {{}} bioData - An object that is the result of calling the generateBioData() function
 * @param {{}} user - An object that is the result of calling either the createStudent() or the createMentor() function
 */
function createAccount(bioData, user) {
  return {
    _id: faker.database.mongodbObjectId(),
    firstName: bioData.firstName,
    lastName: bioData.lastName,
    email: bioData.email,
    password: faker.internet.password(20, true, /[a-z]/, '*&0A'),
    track: faker.helpers.arrayElement(track),
    owner: user._id,
  };
}

/**
 * Generate biodata
 * @return {{}} An object with name, email and sex.
 */
function generateBioData() {
  const sex = Math.floor(Math.random() * 10) % 2 === 0 ? 'male' : 'female';
  const firstName = faker.name.firstName(sex);
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName, 'getnada.com');

  return {
    firstName,
    lastName,
    email,
    sex,
  };
}

/**
 * Generate question
 * @return {{}} A question object
 */
function generateQuestion() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(),
    author: faker.helpers.arrayElement(accountIds),
  };
}

/**
 * Generate answer
 * @return {{}} An answer object
 */
function generateAnswer() {
  return {
    content: faker.lorem.paragraph(),
    questionId: faker.helpers.arrayElement(questionIds),
  };
}

/**
 * Generate user information to send to server via http requests
 * @param {string} userType - The type of user to create.
 * @return {{}} An object with properties of associated user type.
 */
function createUserForReq(type) {
  const key = String(type).toLowerCase();
  if (key !== 'student' && key !== 'mentor' && key !== 'admin') return null;

  const { account, user } = createUser(key);
  const agg = {
    ...account,
    ...user,
  };
  // eslint-disable-next-line
  const { _id, owner, accountType, ...data } = agg;

  return {
    ...data,
  };
}

module.exports = {
  createUser,
  createUserForReq,
  generateQuestion,
  generateAnswer,
};
