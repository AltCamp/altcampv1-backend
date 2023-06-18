const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');

const url = '/bookmarks';
const postType = 'Post';
const title = 'This is an intriguing thing';
let token;

beforeAll(async () => {
  // connect to database
  await dbConnect();

  // get 'dummy' entities from helper
  const { accounts, bookmarks, students, mentors, posts } = helper;

  // data structure to hold 'dummy' entities to be created
  const entities = accounts.concat(bookmarks, students, mentors, posts);

  // create entities in database
  await Promise.all(entities);
});

describe('Creating a bookmark', () => {
  // get a post
  test('fails if a user is not logged in', async () => {
    const postsInDb = await helper.postsInDb();
    const { _id } = postsInDb[0];

    // send a post request with id of Post
    await api
      .post(url)
      .send({
        title,
        postType,
        postId: _id,
      })
      .expect(401);
  });

  test('is successful if a user is logged in', async () => {
    const postsInDb = await helper.postsInDb();
    const { _id, content, author } = postsInDb[0];
    const postAuthor = helper.accountsAsJson.find(
      ({ _id }) => _id === author.toString()
    );
    // Log in as a student
    const user = helper.accountsAsJson[0];
    await login(user);

    // send a post request with id of Post
    const response = await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title,
        postType,
        postId: _id,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('title', title);
    expect(response.body.data).toHaveProperty('isRead', false);
    expect(response.body.data.owner).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: expect.any(String),
      })
    );
    expect(response.body.data).toHaveProperty('postType', postType);
    expect(response.body.data.post).toEqual(
      expect.objectContaining({
        _id: _id.toString(),
        content: content,
        author: expect.objectContaining({
          _id: postAuthor._id,
          firstName: postAuthor.firstName,
          lastName: postAuthor.lastName,
          profilePicture: expect.any(String),
        }),
      })
    );
  });
});

describe('Fetching bookmarks', () => {
  test('fails if user is not logged in', async () => {
    await api.get(url).expect(401);
  });

  test('only returns bookmarks of logged in user', async () => {
    const user = helper.accountsAsJson[2];
    await login(user);

    const response = await api
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);

    let owner = response.body.data.map(({ owner }) => owner._id.toString());
    owner = new Set(owner);
    owner = Array.from(owner);
    expect(owner.length).toBe(1);
    expect(owner[0]).toBe(user._id);
  });

  test('by ID returns 404 if logged in user is not author', async () => {
    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id } = bookmarksInDb[0];

    const user = helper.accountsAsJson[0];
    await login(user);

    await api
      .get(`${url}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});

describe('Updating a bookmark', () => {
  test('fails if user is not logged in', async () => {
    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id } = bookmarksInDb[0];

    await api
      .patch(`${url}/${_id}`)
      .send({
        isRead: true,
      })
      .expect(401);
  });

  test('fails if logged in user is not owner', async () => {
    const user = helper.accountsAsJson[4];
    await login(user);

    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id } = bookmarksInDb[0];

    await api
      .patch(`${url}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Heyyo!',
        isRead: true,
      })
      .expect(401);
  });

  test('is successful if logged in user is owner', async () => {
    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id, owner, post } = bookmarksInDb[0];

    const postsInDb = await helper.postsInDb();
    const bookmarkedPost = postsInDb.find(
      ({ _id }) => _id.toString() === post.toString()
    );
    const bookmarkedPostAuthor = helper.accountsAsJson.find(
      ({ _id }) => _id === bookmarkedPost.author.toString()
    );

    const user = helper.accountsAsJson.find(
      ({ _id }) => _id === owner.toString()
    );
    await login(user);
    const title2 = 'Heyyo!';

    const response = await api
      .patch(`${url}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: title2,
        isRead: true,
      })
      .expect(200);

    expect(response.body.data).toHaveProperty('_id', _id.toString());
    expect(response.body.data).toHaveProperty('title', title2);
    expect(response.body.data).toHaveProperty('isRead', true);
    expect(response.body.data.owner).toEqual(
      expect.objectContaining({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: expect.any(String),
      })
    );
    expect(response.body.data).toHaveProperty('postType', postType);
    expect(response.body.data.post).toEqual(
      expect.objectContaining({
        _id: bookmarkedPost._id.toString(),
        content: bookmarkedPost.content,
        author: expect.objectContaining({
          _id: bookmarkedPostAuthor._id,
          firstName: bookmarkedPostAuthor.firstName,
          lastName: bookmarkedPostAuthor.lastName,
          profilePicture: expect.any(String),
        }),
      })
    );
  });

  test('fails if request contains invalid properties', async () => {
    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id, owner } = bookmarksInDb[0];

    const user = helper.accountsAsJson.find(
      ({ _id }) => _id === owner.toString()
    );
    await login(user);

    await api
      .patch(`${url}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        balablue: 'bulaba!',
      })
      .expect(422);
  });
});

describe('Deleting a bookmark', () => {
  test('fails if user is not logged in', async () => {
    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id } = bookmarksInDb[0];

    await api.delete(`${url}/${_id}`).expect(401);
  });

  test('fails if logged in user is not owner', async () => {
    const user = helper.accountsAsJson[4];
    await login(user);

    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id } = bookmarksInDb[0];

    await api
      .delete(`${url}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  test('is successful if user is owner', async () => {
    const bookmarksInDb = await helper.bookmarksInDb();
    const { _id, owner } = bookmarksInDb[0];

    const user = helper.accountsAsJson.find(
      ({ _id }) => _id === owner.toString()
    );
    await login(user);

    await api
      .delete(`${url}/${_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
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
