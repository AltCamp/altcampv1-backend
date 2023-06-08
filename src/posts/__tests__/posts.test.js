const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');

let token;
const url = '/posts';

beforeAll(async () => {
  // connect to database
  await dbConnect();

  // get 'dummy' entities from helper
  const { accounts, students, mentors, posts } = helper;

  // data structure to hold 'dummy' entities to be created
  const entities = accounts.concat(students, mentors, posts);

  // create entities in database
  await Promise.all(entities);
});

describe('Creating a post', () => {
  const { content, author } = helper.generatePost();

  test('fails if a user is not logged in', async () => {
    await api.post(url).send({ content }).expect(401);
  });

  test('is successful if a user is logged in', async () => {
    const user = helper.accountsAsJson.find((account) => {
      return account._id === author.toString();
    });
    await login(user);

    const response = await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({ content })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data).toMatchObject({
      content,
      author: expect.objectContaining({
        _id: author.toString(),
        firstName: expect.any(String),
        lastName: expect.any(String),
      }),
      upvotes: 0,
      upvotedBy: [],
      __v: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      comments: [],
    });
  });
});

describe('Modifying a post', () => {
  const { _id: postId, author } = helper.postsAsJson[0];
  test('fails if a user is not logged in', async () => {
    const content = 'This is an update to the post.';

    await api.patch(`${url}/${postId}`).send({ content }).expect(401);
  });

  test('fails if a logged in user is not the author', async () => {
    const user = helper.accountsAsJson[1];
    await login(user);

    const content =
      'Jargons aid testing. Finishing in the meadow is cumbersome. - Morrison';

    await api
      .patch(`${url}/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('is successful if a logged in user is the author', async () => {
    const users = helper.accountsAsJson;
    const user = users.find((user) => user._id === author);
    await login(user);

    const content = 'Judas and Jonah. Silver lining on/in a whale.';

    const response = await api
      .patch(`${url}/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data).toHaveProperty('content', content);
  });
});

describe('Upvoting/liking a post', () => {
  const { _id: postId } = helper.postsAsJson[0];
  test('fails if a user is not logged in', async () => {
    await api.patch(`${url}/${postId}/upvote`).expect(401);
  });

  test('is successful if a user is logged in', async () => {
    let postsInDb = await helper.postsInDb();
    let post = postsInDb.find((post) => post._id.toString() === postId);

    const users = helper.accountsAsJson;
    let user = users[0];
    await login(user);

    const response = await api
      .patch(`${url}/${postId}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.upvotes).toBe(post.upvotes + 1);
    expect(response.body.data.upvotedBy).toContain(user._id);

    user = users[1];
    await login(user);

    const res = await api
      .patch(`${url}/${post._id}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.data.upvotes).toBe(post.upvotes + 2);
    expect(res.body.data.upvotedBy).toContain(user._id);
  });

  test('if a user has previously upvoted/liked removes the upvote/like', async () => {
    const postsInDb = await helper.postsInDb();
    const post = postsInDb.find((post) => {
      return post._id.toString() === postId;
    });
    const users = helper.accountsAsJson;
    const user = users[0];
    await login(user);

    const response = await api
      .patch(`${url}/${postId}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.upvotes).toBe(post.upvotes - 1);
    expect(response.body.data.upvotedBy).not.toContain(user._id);
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
