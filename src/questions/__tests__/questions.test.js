const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { generateSlug } = require('../../../utils/helper');
const { RESPONSE_MESSAGE } = require('../../../constant');

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

describe('Creating a question', () => {
  test('fails if a user is not logged in', async () => {
    // generate a question
    const { title, body } = helper.generateQuestion();

    // send a post request with generated question
    await api
      .post('/questions')
      .send({
        title,
        body,
      })
      .expect(401);
  });

  test('fails if a user is logged in and email is not verified', async () => {
    // Log in as a student
    const user = helper.accountsAsJson[1];
    await login(user);

    // generate a question
    const { title, body } = helper.generateQuestion();

    // send a post request with generated question
    const response = await api
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title,
        body,
      })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body).toHaveProperty(
      'message',
      RESPONSE_MESSAGE.NOT_VERIFIED
    );
  });

  test('is successful if a user is logged in and email is verified', async () => {
    // Log in as a student
    const user = helper.accountsAsJson[0];
    await login(user);

    const tags = ['askme', 'patience', 'goodfish'];
    // generate a question
    const { title, body } = helper.generateQuestion();
    const slug = generateSlug(title);

    // send a post request with generated question
    const response = await api
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title,
        body,
        tags,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('title', title);
    expect(response.body.data).toHaveProperty('body', body);
    expect(response.body.data).toHaveProperty('upvotes', 0);
    expect(response.body.data).toHaveProperty('downvotes', 0);
    expect(response.body.data.author).toEqual({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: expect.any(String),
    });
    expect(response.body.data).toHaveProperty('slug', slug);
    expect(
      JSON.stringify(response.body.data.tags.map(({ name }) => name))
    ).toBe(JSON.stringify(Object.values(tags)));
  });
});

describe('Modifying a question', () => {
  test('fails if a user is not logged in', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // send a patch request to update question
    await api
      .patch(`/questions/${questions[0]._id.toString()}`)
      .send({
        body: 'An updated body of a question to aid testing. Let us get it!',
      })
      .expect(401);
  });

  test('fails if a logged in user is not the author', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // Log in as a student
    const user = helper.accountsAsJson[2];
    await login(user);

    // send a patch request to update question]
    const body = 'An updated body of a question to aid testing. Let us get it!';

    await api
      .patch(`/questions/${questions[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('is successful if a logged in user is the author and email is verified', async () => {
    // Log in
    const users = helper.accountsAsJson;
    const user = users.find((user) => user.emailIsVerified);
    await login(user);

    // get question from DB
    const questions = await helper.questionsInDb();
    const question = questions.find(
      (question) => question.author._id.toString() === user._id.toString()
    );

    // send a patch request to update question
    const body = 'An updated body of a question to aid testing. Let us get it!';
    const title = 'Will Manchester City win the 2023 Champions League?';
    const slug = generateSlug(title);
    const tags = ['hopes', 'dreams'];

    const response = await api
      .patch(`/questions/${question._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body, title, tags })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data).toHaveProperty('body', body);
    expect(response.body.data).toHaveProperty('slug', slug);
    expect(response.body.data.author).toEqual({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: expect.any(String),
    });
    expect(
      JSON.stringify(response.body.data.tags.map(({ name }) => name))
    ).toBe(JSON.stringify(Object.values(tags)));
  });
});

describe('Upvoting a question', () => {
  test('fails if a user is not logged in', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // send a patch request to upvote question
    await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .expect(401);
  });

  test('fails if a user is logged in and email is not verified', async () => {
    // get questions from DB
    let questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    let user = users[1];
    await login(user);

    // send a patch request to upvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body).toHaveProperty(
      'message',
      RESPONSE_MESSAGE.NOT_VERIFIED
    );
  });

  test('is successful if a user is logged in and email is verified', async () => {
    // get questions from DB
    let questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    let user = users[0];
    await login(user);

    // send a patch request to upvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.upvotes).toBe(questions[0].upvotes + 1);
    expect(response.body.data.upvotedBy).toContain(user._id);
    expect(response.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );

    // get questions from DB
    questions = await helper.questionsInDb();

    // Log in as another user
    user = users[2];
    await login(user);

    // send a patch request to upvote question
    const response2 = await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response2 for specific properties
    expect(response2.body.data.upvotes).toBe(questions[0].upvotes + 1);
    expect(response2.body.data.upvotedBy).toContain(user._id);
    expect(response2.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );
  });

  test('if a verified user has previously upvoted removes the vote', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    const user = users[0];
    await login(user);

    // send a patch request to upvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.upvotes).toBe(questions[0].upvotes - 1);
    expect(response.body.data.upvotedBy).not.toContain(user._id);
    expect(response.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );
  });

  test('if a verified user has previously downvoted removes the downvote', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    const user = users[0];
    await login(user);

    // send a patch request to downvote question
    const res = await api
      .patch(`/questions/${questions[0]._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(res.body.data.downvotes).toBe(questions[0].downvotes + 1);
    expect(res.body.data.downvotedBy).toContain(user._id);
    expect(res.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );

    // send a patch request to downvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.upvotes).toBe(questions[0].upvotes + 1);
    expect(response.body.data.upvotedBy).toContain(user._id);
    expect(response.body.data.downvotes).toBe(questions[0].downvotes);
    expect(response.body.data.downvotedBy).not.toContain(user._id);
    expect(response.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );
  });
});

describe('Downvoting a question', () => {
  test('fails if a user is not logged in', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // send a patch request to downvote question
    await api
      .patch(`/questions/${questions[0]._id.toString()}/downvote`)
      .expect(401);
  });

  test('is successful if a user is logged in and email is verified', async () => {
    // get questions from DB
    let questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    let user = users[0];
    await login(user);

    // send a patch request to downvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.downvotes).toBe(questions[0].downvotes + 1);
    expect(response.body.data.downvotedBy).toContain(user._id);
    expect(response.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );

    // get questions from DB
    questions = await helper.questionsInDb();

    // Log in as another user
    user = users[2];
    await login(user);

    // send a patch request to downvote question
    const response2 = await api
      .patch(`/questions/${questions[0]._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response2 for specific properties
    expect(response2.body.data.downvotes).toBe(questions[0].downvotes + 1);
    expect(response2.body.data.downvotedBy).toContain(user._id);
    expect(response2.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );
  });

  test('if a verified user has previously downvoted removes the vote', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    const user = users[0];
    await login(user);

    // send a patch request to downvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.downvotes).toBe(questions[0].downvotes - 1);
    expect(response.body.data.downvotedBy).not.toContain(user._id);
    expect(response.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );
  });

  test('if a verified user has previously upvoted removes the upvote', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // Log in as a user
    const users = helper.accountsAsJson;
    const user = users[0];
    await login(user);

    // send a patch request to upvote question
    const res = await api
      .patch(`/questions/${questions[0]._id.toString()}/upvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(res.body.data.upvotes).toBe(questions[0].upvotes + 1);
    expect(res.body.data.upvotedBy).toContain(user._id);
    expect(res.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );

    // send a patch request to downvote question
    const response = await api
      .patch(`/questions/${questions[0]._id.toString()}/downvote`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.downvotes).toBe(questions[0].downvotes + 1);
    expect(response.body.data.downvotedBy).toContain(user._id);
    expect(response.body.data.upvotes).toBe(questions[0].upvotes);
    expect(response.body.data.upvotedBy).not.toContain(user._id);
    expect(response.body.data.author).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profilePicture: expect.any(String),
      })
    );
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
