const cloudinary = require('cloudinary').v2;
const { faker } = require('@faker-js/faker');
const { ACCOUNT_TYPES, POST_TYPES } = require('../constant');
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
const postIds = [
  '7d2d9845bc4aae6f3cfa49af',
  'e7fefcdfbabadb4ffb1bebd3',
  'f48e28d4cfbcd439c354cf29',
  '9cac1cb3d972a7c6c55cf91d',
  'aff7ceb1a8f1042acaabaae2',
  '242070c48b8a0f8c9bc1fa36',
  'be9c34bfdd066f7e0f0d594e',
  'c4b7b085caecd4b4ef4ba1d8',
  'f1c9f3b1aaa7928c5ebac62d',
  '9aeb2a1caaa2cf74e24778c0',
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
    category: ACCOUNT_TYPES.MENTOR,
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
    category: ACCOUNT_TYPES.STUDENT,
  };

  return { account, user: student };
}

/**
 * Create a mentor entity
 */
function createMentor() {
  return {
    _id: faker.database.mongodbObjectId(),
  };
}

/**
 * Create a student entity
 * @param {{string}} {sex} - The sex of the student entity to create ({ sex: 'male' } || { sex: 'female' })
 */

function getSchoolId() {
  const characters = 'EDP'.split('');
  const numbers = '0123456789'.split('');
  const altSchoolId = `ALT/SO${faker.helpers.arrayElement(
    characters
  )}/022/${faker.helpers.arrayElement(numbers)}${faker.helpers.arrayElement(
    numbers
  )}${faker.helpers.arrayElement(numbers)}${faker.helpers.arrayElement(
    numbers
  )}`;
  return altSchoolId;
}

function createStudent() {
  return {
    _id: faker.database.mongodbObjectId(),
    altSchoolId: getSchoolId(),
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

function createBookmark() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.lorem.sentence(),
    postType: POST_TYPES.POST,
    post: faker.helpers.arrayElement(postIds),
    owner: faker.helpers.arrayElement(accountIds),
  };
}

/**
 * Generate post
 * @return {{}} A post object
 */
function generatePost() {
  return {
    _id: faker.database.mongodbObjectId(),
    content: faker.lorem.paragraphs(),
    author: faker.helpers.arrayElement(accountIds),
  };
}

/**
 * Generate comment
 * @return {{}} A comment object
 */
function generateComment() {
  return {
    _id: faker.database.mongodbObjectId(),
    content: faker.lorem.paragraph(),
    postId: faker.helpers.arrayElement(postIds),
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

function clearImageTestFolder(folderName) {
  cloudinary.api.delete_resources_by_prefix(folderName);
}

module.exports = {
  createUser,
  createBookmark,
  createUserForReq,
  generateAnswer,
  generateComment,
  generatePost,
  generateQuestion,
  clearImageTestFolder,
};
