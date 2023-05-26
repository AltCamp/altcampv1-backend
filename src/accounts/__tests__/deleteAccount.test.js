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
  it('should return error when password is missing', async () => {
    const response = await api.delete('/accounts/delete-account');
    expect(response.status).toBe(422);
  });

  it('should pass when correct password is provided', async () => {
    const response = await api
      .delete('/accounts/delete-account')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: '8XLxWgzXSPh9ABS!' });
    expect(response.status).toBe(200);
    expect(response.body.data.isDeleted).toBe(true);
  });

  it('should return error when wrong password is provided', async () => {
    const response = await api
      .delete('/accounts/delete-account')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: '8XLxWgzXSPh9ABS' });
    expect(response.status).toBe(401);
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
