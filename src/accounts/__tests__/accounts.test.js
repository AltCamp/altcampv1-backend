const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');

let token;

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

describe('Upload profile picture', () => {
  it('should fail if not logged in', async () => {
    const response = await api.post('/accounts/upload-profile-picture');

    expect(response.status).toBe(401);
  });

  it('should fail if payload contains unwanted properties', async () => {
    const response = await api
      .post('/accounts/upload-profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .send({
        randomProp: 'Musa',
      });

    expect(response.status).toBe(422);
  });

  it ('should return an image url', async () => {
    const response = await api
      .post('/accounts/upload-profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('profilePicture', 'test/testImage.jpg');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('imageUrl');
    expect(response.body.data.imageUrl).toMatch(/https:\/\/res.cloudinary.com\/.*/);
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