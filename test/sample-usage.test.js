const { dbConnect, dbCleanUP, dbDisconnect } = require('./test.db');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('./testHelper');

beforeAll(async () => {
  // connect to database
  await dbConnect();

  // get 'dummy' entities from helper
  const { accounts, students, mentors } = helper;

  // data structure to hold 'dummy' entities to be created
  const entities = accounts.concat(students, mentors);

  // create entities in database
  await Promise.all(entities);
});

describe('Sample test', () => {
  it('should have the same number of students as in the fixtures', async () => {
    const studentsInDb = await helper.studentsInDb();
    const response = await api.get('/students');

    expect(studentsInDb.length).toBe(response.body.length);
  });

  it('should register a new mentor', async () => {
    // generate data to send as request payload
    const user = helper.generateFreshMentorData();

    // send data and get server response
    const response = await api.post('/auth/mentor').send(user);

    // run tests against the received response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg', 'Mentor created successfully');
    expect(response.body).toHaveProperty('account');
    expect(response.body).toHaveProperty('mentor');
    expect(response.body).toHaveProperty('token');
    expect(response.body.account).toEqual(
      expect.objectContaining({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        track: user.track,
        accountType: 'Mentor',
        owner: response.body.mentor._id,
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});
