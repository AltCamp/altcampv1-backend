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
    firstname: bioData.firstname,
    lastname: bioData.lastname,
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
  const firstname = faker.name.firstName(sex);
  const lastname = faker.name.lastName();
  const email = faker.internet.email(firstname, lastname, 'getnada.com');

  return {
    firstname,
    lastname,
    email,
    sex,
  };
}

/**
 * Generate question
 * @return {{}} A question object
 */
function generateQuestion() {
  const accountIds = [
    'f48bded06c714ab2db26afc4',
    'd7aebfdadd09c1db42abe3c4',
    'cf5eb0beed7ccf6aac8731df',
    'c5dfc38b35a8dda8abc311ab',
    '4bcebfd7489feca57be23aff',
  ];
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(),
    author: faker.helpers.arrayElement(accountIds),
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
};
