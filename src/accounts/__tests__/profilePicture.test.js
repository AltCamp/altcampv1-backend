const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { deleteFolder, clearFolderInCdn } = require('../../../test/testUtils');
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
  deleteFolder('src/accounts/tmp/uploads');
  clearFolderInCdn('profile-pictures');
});

describe('Upload profile picture', () => {
  it('should fail if not logged in', async () => {
    const response = await api.put('/accounts/upload-profile-picture');

    expect(response.status).toBe(401);
  });

  it('should return an image url', async () => {
    const response = await api
      .put('/accounts/upload-profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('profilePicture', 'test/fixtures/testImage.jpeg');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('profilePicture');
    expect(
      response.body.data.profilePicture.startsWith('https://res.cloudinary.com')
    ).toBe(true);
  });

  it('should return an error if payload contains unwanted properties', async () => {
    const response = await api
      .put('/accounts/upload-profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .field('randomProp', 'Musa')
      .attach('profilePicture', 'test/fixtures/testImage.jpeg');

    expect(response.status).toBe(400);
  });

  it('should return an error if file format is incorrect', async () => {
    const response = await api
      .put('/accounts/upload-profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('profilePicture', 'test/fixtures/testFile.txt');

    expect(response.status).toBe(422);
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
