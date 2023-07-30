const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const { RESPONSE_MESSAGE, ACCOUNT_TYPES } = require('../../../constant');

const url = '/comments';
let token;
let responseCommentId;

async function login({ email, password }) {
  const response = await api.post('/auth/login').send({ email, password });
  if (response.status === 200) {
    token = response.body.data.token;
    return;
  }
  token = null;
}

beforeAll(async () => {
  // connect to database
  await dbConnect();

  // get 'dummy' entities from helper
  const { accounts, students, mentors, comments, posts } = helper;

  // data structure to hold 'dummy' entities to be created
  const entities = accounts.concat(students, mentors, comments, posts);

  // create entities in database
  await Promise.all(entities);
});

describe('Creating comment', () => {
  const post = helper.postsAsJson[1];
  const comment = helper.generateComment();

  it('fails if a user is not logged in', async () => {
    await api
      .post(url)
      .send({
        content: comment.content,
        postId: post._id,
      })
      .expect(401);
  });

  it('fails if a non-verified user is logged in', async () => {
    const user = helper.accountsAsJson.find((account) => {
      return account.emailIsVerified !== true;
    });
    await login(user);

    const response = await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: comment.content,
        postId: post._id,
      })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(RESPONSE_MESSAGE.NOT_VERIFIED);
  });

  it('is successful if a verified user is logged in', async () => {
    const user = helper.accountsAsJson.find((account) => {
      return (
        account.emailIsVerified === true &&
        account.accountType === ACCOUNT_TYPES.STUDENT
      );
    });
    await login(user);

    const response = await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: comment.content,
        postId: post._id,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    responseCommentId = response.body.data._id;

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('content', comment.content);
    expect(response.body.data).toHaveProperty('upvotes');
    expect(response.body.data).toHaveProperty('upvotedBy');
    expect(response.body.data).toHaveProperty('downvotes');
    expect(response.body.data).toHaveProperty('downvotedBy');
    expect(response.body.data.author).toEqual({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: expect.any(String),
    });
    expect(response.body.data.author).toHaveProperty('_id', user._id);
    expect(response.body.data).toHaveProperty('post', post._id);
  });

  it('updates the post with comment', async () => {
    const posts = await helper.postsInDb();

    const postInDb = posts.find((dbPost) => dbPost._id.toString() === post._id);
    const commentsInDb = postInDb.comments.map((comment) => comment.toString());
    expect(commentsInDb).toContain(responseCommentId);
  });
});

describe('Modifying a comment', () => {
  const content = 'Live life my guys! Do not think twice.';

  it('fails if a user is not logged in', async () => {
    await api
      .patch(`${url}/${responseCommentId}`)
      .send({
        content,
      })
      .expect(401);
  });

  it('fails if a logged in user is not the author', async () => {
    const user = helper.accountsAsJson.find((account) => {
      return (
        account.emailIsVerified === true &&
        account.accountType === ACCOUNT_TYPES.MENTOR
      );
    });
    await login(user);

    await api
      .patch(`${url}/${responseCommentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content,
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  it('is successful if a logged in user is the author', async () => {
    const commentsInDb = await helper.commentsInDb();
    const commentInDb = commentsInDb[3];

    const users = helper.accountsAsJson;
    const user = users.find((user) => {
      return user._id.toString() === commentInDb.author._id.toString();
    });
    await login(user);

    const response = await api
      .patch(`${url}/${commentInDb._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data).toHaveProperty('content', content);
    expect(response.body.data.author).toEqual({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: expect.any(String),
    });
  });
});

describe('Upvoting a comment', () => {
  let user, comment;
  it('fails if a user is not logged in', async () => {
    const comments = await helper.commentsInDb();
    comment = comments[0];

    await api.patch(`${url}/${comment._id.toString()}/upvote`).expect(401);
  });

  it('is successful if a user is logged in', async () => {
    const commentsInDb = await helper.commentsInDb();
    comment = commentsInDb[2];

    const users = helper.accountsAsJson;
    user = users.find((account) => {
      return (
        account.emailIsVerified === true &&
        account.accountType === ACCOUNT_TYPES.MENTOR
      );
    });
    await login(user);

    const response = await api
      .patch(`${url}/${comment._id}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.upvotes).toBe(comment.upvotes + 1);
    expect(response.body.data.upvotedBy).toContain(user._id);
    expect(response.body.data.author).toEqual({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      profilePicture: expect.any(String),
    });

    user = users.find((account) => {
      return (
        account.emailIsVerified === true &&
        account.accountType === ACCOUNT_TYPES.STUDENT
      );
    });
    await login(user);

    const res = await api
      .patch(`${url}/${comment._id}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.data.upvotes).toBe(comment.upvotes + 2);
    expect(res.body.data.upvotedBy).toContain(user._id);
    expect(res.body.data.author).toEqual({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      profilePicture: expect.any(String),
    });
  });

  it('if a user has previously upvoted removes the vote', async () => {
    const commentsInDb = await helper.commentsInDb();
    comment = commentsInDb.find(
      (comm) => comm._id.toString() === comment._id.toString()
    );

    await login(user);

    const response = await api
      .patch(`${url}/${comment._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.upvotes).toBe(comment.upvotes - 1);
    expect(response.body.data.upvotedBy).not.toContain(user._id);
    expect(response.body.data.author).toEqual({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      profilePicture: expect.any(String),
    });
  });
});

describe('Downvoting a comment', () => {
  let user, comment;
  it('fails if a user is not logged in', async () => {
    const comments = await helper.commentsInDb();
    comment = comments[0];

    await api.patch(`${url}/${comment._id.toString()}/downvote`).expect(401);
  });

  it('is successful if a user is logged in', async () => {
    const users = helper.accountsAsJson;
    user = users.find((account) => {
      return (
        account.emailIsVerified === true &&
        account.accountType === ACCOUNT_TYPES.MENTOR
      );
    });
    await login(user);

    const response = await api
      .patch(`${url}/${comment._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.downvotes).toBe(comment.downvotes + 1);
    expect(response.body.data.downvotedBy).toContain(user._id);
    expect(response.body.data.author).toEqual({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      profilePicture: expect.any(String),
    });

    user = users.find((account) => {
      return (
        account.emailIsVerified === true &&
        account.accountType === ACCOUNT_TYPES.STUDENT
      );
    });
    await login(user);

    const res = await api
      .patch(`${url}/${comment._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.data.downvotes).toBe(comment.downvotes + 2);
    expect(res.body.data.downvotedBy).toContain(user._id);
    expect(res.body.data.author).toEqual({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      profilePicture: expect.any(String),
    });
  });

  it('if a user has previously downvoted removes the vote', async () => {
    const comments = await helper.commentsInDb();
    comment = comments.find(
      (comm) => comm._id.toString() === comment._id.toString()
    );

    await login(user);

    const response = await api
      .patch(`${url}/${comment._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.downvotes).toBe(comment.downvotes - 1);
    expect(response.body.data.downvotedBy).not.toContain(user._id);
    expect(response.body.data.author).toEqual({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      profilePicture: expect.any(String),
    });
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});
