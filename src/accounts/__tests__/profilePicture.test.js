const fs = require('fs');
const path = require('path');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { clearImageTestFolder } = require('../../../test/testUtils');
let token;
let profilePicture;

const filePath = path.join(
  process.cwd(),
  'test',
  'fixtures',
  'base64Image.txt'
);

beforeAll(async () => {
  await dbConnect();

  const { accounts } = helper;

  // create account in database
  await Promise.all(accounts);

  const user = helper.accountsAsJson[0];
  await login(user);

  profilePicture = fs.readFileSync(filePath, { encoding: 'utf-8' });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
  clearImageTestFolder('test/images/profile-pictures');
});

describe('Upload profile picture', () => {
  it('should fail if not logged in', async () => {
    const response = await api.post('/accounts/profile-picture');

    expect(response.status).toBe(401);
  });

  it('should return an image url', async () => {
    const response = await api
      .post('/accounts/profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ profilePicture: profilePicture });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('profilePicture');
    expect(
      response.body.data.profilePicture.startsWith('https://res.cloudinary.com')
    ).toBe(true);
  });

  it('should return an error if payload contains unwanted properties', async () => {
    const response = await api
      .post('/accounts/profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .send({ profilePicture: profilePicture, randomProp: 'test' });

    expect(response.status).toBe(422);
  });

  it('should return an error if file format is incorrect', async () => {
    const response = await api
      .post('/accounts/profile-picture')
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
