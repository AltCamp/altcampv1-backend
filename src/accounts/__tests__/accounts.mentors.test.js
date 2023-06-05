const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { ACCOUNT_TYPES } = require('../../../constant');

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

describe('GET requests', () => {
  it('to /accounts?category=Mentor returns mentor accounts', async () => {
    const response = await api.get('/accounts?category=Mentor').expect(200);

    response.body.data.forEach(({ accountType }) => {
      expect(accountType).toBe('Mentor');
    });
  });
});

describe('Updating a mentor', () => {
  it('with profile while not logged in should fail', async () => {
    const response = await api.put('/accounts').send({
      firstName: 'Musa',
      lastName: 'Mesly',
    });

    expect(response.status).toBe(401);
  });

  it('with profile should fail if payload contains unwanted properties', async () => {
    const user = helper.accountsAsJson[4];
    await login(user);

    const response = await api
      .put('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        randomProp: 'Musa',
      });

    expect(response.status).toBe(422);
  });

  it('with profile should fail if payload contains invalid properties', async () => {
    const user = helper.accountsAsJson[4];
    await login(user);

    const response = await api
      .put('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        track: 'Captcha',
      });

    expect(response.status).toBe(422);
  });

  it('with profile is successful', async () => {
    const user = helper.accountsAsJson[4];
    await login(user);

    const firstName = 'Updated';
    const lastName = 'Elections';
    const track = 'Data Engineering';

    const response = await api
      .put('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName, lastName, track });

    expect(response.body.data).toHaveProperty('firstName', firstName);
    expect(response.body.data).toHaveProperty('lastName', lastName);
    expect(response.body.data).toHaveProperty(
      'accountType',
      ACCOUNT_TYPES.MENTOR
    );
  });

  it('with biography is successful', async () => {
    const user = helper.accountsAsJson[4];
    await login(user);

    const bio = 'In the West, they call me the King in the North';

    const response = await api
      .put('/accounts/bio')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio });

    expect(response.body.data).toHaveProperty('bio', bio);
    expect(response.body.data).toHaveProperty(
      'accountType',
      ACCOUNT_TYPES.MENTOR
    );
  });

  it('with biography while not logged is unsuccessful', async () => {
    const bio = 'In the West, they call me the King in the North';

    const response = await api.put('/accounts/bio').send({ bio });

    expect(response.status).toBe(401);
  });

  // it('with secure password is successful', async () => {
  //   const user = helper.accountsAsJson[5];
  //   await login(user);

  //   const { password: oldPassword } = user;
  //   const newPassword = 'ASecurePassword@1234';

  //   const response = await api
  //     .put('/accounts/password')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({
  //       oldPassword,
  //       password: newPassword,
  //       retypePassword: newPassword,
  //     });

  //   expect(response.status).toBe(200);

  //   const loginAttempt = await api
  //     .post('/auth/login')
  //     .send({ email: user.email, password: newPassword });

  //   expect(loginAttempt.status).toBe(200);
  //   expect(loginAttempt.body.data).toHaveProperty('token');
  //   expect(response.body.data).toHaveProperty(
  //     'accountType',
  //     ACCOUNT_TYPES.MENTOR
  //   );
  // });

  // it('with secure password and invalid parameters is not successful', async () => {
  //   const user = helper.accountsAsJson[4];
  //   await login(user);

  //   const newPassword = 'ASecurePassword@1234';

  //   const response = await api
  //     .put('/accounts/password')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({ password: newPassword, retypePassword: 'password' });

  //   expect(response.status).toBe(422);
  // });

  // it('with unsecure password is not successful', async () => {
  //   const user = helper.accountsAsJson[6];
  //   await login(user);

  //   const { password } = user;
  //   const newPassword = 'AnunSecurePassword';

  //   await api
  //     .put('/accounts/password')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({
  //       oldPassword: password,
  //       password: newPassword,
  //       retypePassword: newPassword,
  //     })
  //     .expect(422);
  // });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});

async function login({ email, password }) {
  const response = await api.post('/auth/login').send({ email, password });
  if (response.status === 200) {
    token = response.body.data.token;
    return;
  }
  token = null;
}
