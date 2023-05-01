const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');

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
      .post(`/questions/${question._id.toString()}/answers`)
      .send({
        body: answer.body,
        question: question._id,
      })
      .expect(401);
  });

  it('is successful if a user is logged in', async () => {
    // Log in as a student
    const user = helper.accountsAsJson[4];
    await login(user);

    // fetch a question
    const question = helper.questionsAsJson[1];

    // generate answer to question
    const answer = helper.generateAnswer();

    const response = await api
      .post(`/questions/${question._id.toString()}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: answer.body,
        question: question._id,
        author: user._id,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // the id of the newly created answer
    responseAnswerId = response.body.data._id;

    // check response for specific properties
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('body', answer.body);
    expect(response.body.data).toHaveProperty('upvotes', []);
    expect(response.body.data).toHaveProperty('downvotes', []);
    expect(response.body.data).toHaveProperty('author', user._id);
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
    const question = helper.questionsAsJson[1]._id;

    // send a patch request to update answer
    await api
      .patch(`/questions/${question.id}/answers/${responseAnswerId}`)
      .send({
        body: 'An updated body of a question to aid testing. Let us get it!',
      })
      .expect(401);
  });

  it('fails if a logged in user is not the author', async () => {
    // get question from question json
    const question = helper.questionsAsJson[1]._id;

    // Log in as a student
    const user = helper.accountsAsJson[1];
    await login(user);

    // send a patch request to update answer
    await api
      .patch(`/questions/${question}/answers/${responseAnswerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: 'updating answer',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  it('is successful if a logged in user is the author', async () => {
    // get question from question json
    const question = helper.questionsAsJson[1]._id;

    // get answers from DB
    const answers = await helper.answersInDb();

    // find the answer from answers fetched from DB
    const answer = answers.find(
      (answer) => answer._id.toString() === responseAnswerId
    );

    // Log in as a student
    const users = helper.accountsAsJson;
    const user = users.find(
      (user) => user._id.toString() === answer.author.toString()
    );
    await login(user);

    // send a patch request to update answer
    const body = 'updating answer';

    const response = await api
      .patch(`/questions/${question}/answers/${responseAnswerId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        body,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // check response for specific properties
    expect(response.body.data).toHaveProperty('body', body);
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});
