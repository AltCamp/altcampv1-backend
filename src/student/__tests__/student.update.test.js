const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');

let token;

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

describe('Updating a student', () => {
  it('with profile while not logged in should fail', async () => {
    const response = await api.put('/students/update-profile').send({
      firstname: 'Musa',
      lastname: 'Mesly',
    });

    expect(response.status).toBe(401);
  });

  it('with profile should fail if payload contains unwanted properties', async () => {
    const user = helper.accountsAsJson[0];
    await login(user);

    const response = await api
      .put('/students/update-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        randomProp: 'Musa',
      });

    expect(response.status).toBe(422);
  });

  it('with profile is successful', async () => {
    const user = helper.accountsAsJson[0];
    await login(user);

    const firstname = 'Updated';
    const lastname = 'Elections';

    const response = await api
      .put('/students/update-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname, lastname });

    expect(response.body).toHaveProperty('firstname', firstname);
    expect(response.body).toHaveProperty('lastname', lastname);
  });

  it('with secure password is successful', async () => {
    const user = helper.accountsAsJson[1];
    await login(user);

    const password = 'ASecurePassword@1234';

    const response = await api
      .put('/students/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password });

    expect(response.status).toBe(200);

    const loginAttempt = await api
      .post('/auth/login')
      .send({ email: user.email, password });

    expect(loginAttempt.status).toBe(200);
    expect(loginAttempt.body).toHaveProperty('accessToken');
  });

  it('with unsecure password is not successful', async () => {
    const user = helper.accountsAsJson[2];
    await login(user);

    const password = 'AnunSecurePassword';

    await api
      .put('/students/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password })
      .expect(422);
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});

async function login({ email, password }) {
  const response = await api.post('/auth/login').send({ email, password });
  if (response.status === 200) {
    token = response.body.accessToken;
    return;
  }
  token = null;
}
