const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const { RESPONSE_MESSAGE } = require('../../../constant');

let token;
let responseAnswerId;

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
  const { accounts, students, mentors, questions, answers } = helper;

  // data structure to hold 'dummy' entities to be created
  const entities = accounts.concat(students, mentors, questions, answers);

  // create entities in database
  await Promise.all(entities);
});

describe('Creating answer to a question', () => {
  it('fails if a user is not logged in', async () => {
    // fetch a question
    const question = helper.questionsAsJson[1];
    // generate answer to question
    const answer = helper.generateAnswer();

    await api
      .post('/answers')
      .send({
        content: answer.content,
        questionId: question._id,
      })
      .expect(401);
  });

  it('fails if a logged in user is not verified', async () => {
    // Log in as a student
    const user = helper.accountsAsJson[5];
    await login(user);

    // fetch a question
    const question = helper.questionsAsJson[1];

    // generate answer to question
    const answer = helper.generateAnswer();

    const response = await api
      .post('/answers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: answer.content,
        questionId: question._id,
      })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body).toHaveProperty(
      'message',
      RESPONSE_MESSAGE.NOT_VERIFIED
    );
  });

  it('is successful if a user is logged in and verified', async () => {
    // Log in as a student
    const user = helper.accountsAsJson[4];
    await login(user);

    // fetch a question
    const question = helper.questionsAsJson[1];

    // generate answer to question
    const answer = helper.generateAnswer();

    const response = await api
      .post('/answers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: answer.content,
        questionId: question._id,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // the id of the newly created answer
    responseAnswerId = response.body.data._id;

    // check response for specific properties
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('content', answer.content);
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
    expect(response.body.data).toHaveProperty('question', question._id);
  });

  it('updates the question with answer', async () => {
    // get questions from DB
    const questions = await helper.questionsInDb();

    // find the question answered from questions fetched from DB
    const question = questions.find(
      (question) => question._id.toString() === helper.questionsAsJson[1]._id
    );
    const stringedObjectIdAnswerArray = question.answer.map((answer) =>
      answer.toString()
    );
    expect(stringedObjectIdAnswerArray).toContain(responseAnswerId);
  });
});

describe('Modifying an answer', () => {
  it('fails if a user is not logged in', async () => {
    // get question from question json
    const questionId = helper.questionsAsJson[1]._id;

    // send a patch request to update answer
    await api
      .patch(`/answers/${responseAnswerId}`)
      .send({
        content: 'An updated body of a question to aid testing. Let us get it!',
        questionId,
      })
      .expect(401);
  });

  it('fails if a logged in user is not the author', async () => {
    // Log in as a student
    const user = helper.accountsAsJson[0];
    await login(user);

    // send a patch request to update answer
    await api
      .patch(`/answers/${responseAnswerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'updating answer',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  it('is successful if a logged in user is the author', async () => {
    // get answers from DB
    const answers = await helper.answersInDb();

    // find the answer from answers fetched from DB
    const answer = answers.find(
      (answer) => answer._id.toString() === responseAnswerId
    );

    // Log in as a student
    const users = helper.accountsAsJson;
    const user = users.find(
      (user) => user._id.toString() === answer.author._id.toString()
    );
    await login(user);

    // send a patch request to update answer
    const content = 'updating answer';

    const response = await api
      .patch(`/answers/${responseAnswerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data).toHaveProperty('content', content);
  });
});

describe('Upvoting an answer', () => {
  let user, answer;
  it('fails if a user is not logged in', async () => {
    const answers = await helper.answersInDb();
    answer = answers[0];

    await api.patch(`/answers/upvote/${answer._id.toString()}`).expect(401);
  });

  it('fails if a logged in user is not verified', async () => {
    // Log in as a user
    const users = helper.accountsAsJson;
    user = users[1];
    await login(user);

    // send a patch request to upvote answer
    const response = await api
      .patch(`/answers/upvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.message).toBe(RESPONSE_MESSAGE.NOT_VERIFIED);

    // Log in as another user
    const user2 = users[5];
    await login(user2);

    // send a patch request to upvote answer
    const response2 = await api
      .patch(`/answers/upvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    // check response2 for specific properties
    expect(response2.body.message).toBe(RESPONSE_MESSAGE.NOT_VERIFIED);
  });

  it('is successful if a user is logged in and verified', async () => {
    // Log in as a user
    const users = helper.accountsAsJson;
    user = users[0];
    await login(user);

    // send a patch request to upvote answer
    const response = await api
      .patch(`/answers/upvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.upvotes).toBe(answer.upvotes + 1);
    expect(response.body.data.upvotedBy).toContain(user._id);

    // Log in as another user
    const user2 = users[4];
    await login(user2);

    // send a patch request to upvote answer
    const response2 = await api
      .patch(`/answers/upvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response2 for specific properties
    expect(response2.body.data.upvotes).toBe(answer.upvotes + 2);
    expect(response2.body.data.upvotedBy).toContain(user2._id);
  });

  it('if a user has previously upvoted removes the vote', async () => {
    const answers = await helper.answersInDb();
    answer = answers.find(
      (ans) => ans._id.toString() === answer._id.toString()
    );

    // Log in as a user
    await login(user);

    // send a patch request to upvote answer
    const response = await api
      .patch(`/answers/upvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.upvotes).toBe(answer.upvotes - 1);
    expect(response.body.data.upvotedBy).not.toContain(user._id);
  });
});

describe('Downvoting an answer', () => {
  let user, answer;
  it('fails if a user is not logged in', async () => {
    const answers = await helper.answersInDb();
    answer = answers[0];

    await api.patch(`/answers/downvote/${answer._id.toString()}`).expect(401);
  });

  it('fails if a user is logged in but not verified', async () => {
    // Log in as a user
    const users = helper.accountsAsJson;
    user = users[1];
    await login(user);

    // send a patch request to upvote answer
    const response = await api
      .patch(`/answers/downvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.message).toBe(RESPONSE_MESSAGE.NOT_VERIFIED);
  });

  it('is successful if a user is logged in and verified', async () => {
    // Log in as a user
    const users = helper.accountsAsJson;
    user = users[0];
    await login(user);

    // send a patch request to upvote answer
    const response = await api
      .patch(`/answers/downvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.downvotes).toBe(answer.downvotes + 1);
    expect(response.body.data.downvotedBy).toContain(user._id);

    // Log in as another user
    const user2 = users[4];
    await login(user2);

    // send a patch request to upvote answer
    const response2 = await api
      .patch(`/answers/downvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response2 for specific properties
    expect(response2.body.data.downvotes).toBe(answer.downvotes + 2);
    expect(response2.body.data.downvotedBy).toContain(user2._id);
  });

  it('if a user has previously downvoted removes the vote', async () => {
    const answers = await helper.answersInDb();
    answer = answers.find(
      (ans) => ans._id.toString() === answer._id.toString()
    );

    // Log in as a user
    await login(user);

    // send a patch request to upvote answer
    const response = await api
      .patch(`/answers/downvote/${answer._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data.downvotes).toBe(answer.downvotes - 1);
    expect(response.body.data.downvotedBy).not.toContain(user._id);
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});
