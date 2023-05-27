const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
let token;
jest.setTimeout(100000);
beforeAll(async () => {
  await dbConnect();

  const { accounts } = helper;

  // create account in database
  await Promise.all(accounts);

  const user = helper.accountsAsJson[0];
  await login(user);
});
afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});

describe('Delete Account', () => {
  const user = helper.accountsAsJson[0];
  it('should return error when password is missing', async () => {
    const response = await api
      .delete('/accounts/delete-account')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422);
    // expect(response.body.message).toBe("\"password\" is required");
  });

  it('should "delete" an account and return isDeleted as true', async () => {
    const response = await api
      .delete('/accounts/delete-account')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: user.password });
    expect(response.status).toBe(200);
    expect(response.body.data.isDeleted).toBe(true);
  });

  it('should return error when wrong password is provided', async () => {
    const response = await api
      .delete('/accounts/delete-account')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: '8XLxWgzXSPh9ABS' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect Password!');
  });
});

async function login({ email, password }) {
  const response = await api.post('/auth/login').send({ email, password });
  if (response.status === 200) {
    token = response.body.data.token;
    return;
  }
  token = null;
}
