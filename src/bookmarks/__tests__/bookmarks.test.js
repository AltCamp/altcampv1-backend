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
  const { accounts, students, mentors, questions } = helper;

  // data structure to hold 'dummy' entities to be created
  const entities = accounts.concat(students, mentors, questions);

  // create entities in database
  await Promise.all(entities);
});

describe('Creating a bookmark', () => {
  const url = '/bookmarks';
  const postType = 'Post';

  // get a post
  test('fails if a user is not logged in', async () => {
    const postsInDb = await helper.postsInDb();
    const { _id } = postsInDb[0];

    // send a post request with id of Post
    await api
      .post(url)
      .send({
        postType,
        postId: _id,
      })
      .expect(401);
  });

  test('is successful if a user is logged in', async () => {
    const postsInDb = await helper.postsInDb();
    const { _id, content } = postsInDb[0];
    // Log in as a student
    const user = helper.accountsAsJson[0];
    await login(user);

    // send a post request with id of Post
    const response = await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        postType,
        postId: _id,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('isRead', false);
    expect(response.body.data.owner).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: user.firstName,
        lastName: user.lastName,
      })
    );
    expect(response.body.data).toHaveProperty('postType', postType);
    expect(response.body.data.post).toEqual(
      expect.objectContaining({
        _id,
        content,
      })
    );
    expect(response.body.data).toHaveProperty('owner', user._id);
  });
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
