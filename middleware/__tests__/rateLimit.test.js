const app = require('../../app');
const supertest = require('supertest');
const request = supertest(app);
const helper = require('../../test/testHelper');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../test/test.db');

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

describe('Rate Limit Test', () => {
  // Increase the timeout for this test to 10 seconds (10000 milliseconds)
  jest.setTimeout(10000);

  const user = helper.accountsAsJson[4];
  const url = '/auth/login';
  const data = { email: user.email, password: user.password };

  it('should pass when rate limit is not exceeded', async () => {
    // Make multiple requests within the rate limit
    const numRequests = 50;
    const responses = await Promise.all(
      Array.from({ length: numRequests }).map(() =>
        request.post(url).send(data)
      )
    );

    // Assert that all responses have a status code of 200
    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });
  });

  it('should fail when rate limit is exceeded', async () => {
    // Make multiple requests within a short time frame to exceed the rate limit
    const numRequests = 51;
    const responses = await Promise.all(
      Array.from({ length: numRequests }).map(() =>
        request.post(url).send(data)
      )
    );

    // Assert that the last response has a status code indicating the rate limit has been exceeded
    const lastResponse = responses[responses.length - 1];
    expect(lastResponse.status).toBe(429);
    expect(lastResponse.body).toHaveProperty(
      'message',
      'Too many requests, please try again later'
    );
    expect(lastResponse.body).toHaveProperty('statusCode', lastResponse.status);
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});
