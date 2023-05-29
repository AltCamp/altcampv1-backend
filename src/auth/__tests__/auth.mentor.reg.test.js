const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../../app');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const { generateFreshMentorData } = require('../../../test/testHelper');

describe('Auth: Account registration', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbCleanUP();
    await dbDisconnect();
  });

  const user = generateFreshMentorData();

  const url = '/auth/register';
  it('should register a new account and return a valid JWT', async () => {
    const response = await request(app).post(url).send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('statusCode', response.status);
    expect(response.body).toHaveProperty(
      'message',
      'Mentor created successfully'
    );
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toEqual({
      __v: 0,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      track: user.track,
      isDeleted: false,
      accountType: 'Mentor',
      owner: expect.objectContaining({}),
      _id: expect.any(String),
      profilePicture: expect.any(String),
      bio: '',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(response.body.data.token).toEqual(expect.any(String));

    // Verify token
    const token = response.body.data.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toEqual(
      expect.objectContaining({
        id: response.body.data.user._id,
      })
    );
  });

  describe('Mentor registration: input validation', () => {
    afterEach(async () => {
      await dbCleanUP();
    });

    it('should not register a new mentor if email already exists', async () => {
      const response = await request(app).post(url).send(user);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Mentor already exists!');
    });

    it('should not register a new mentor if password is not provided', async () => {
      const response = await request(app)
        .post(url)
        .send({
          ...user,
          password: '',
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Password is required');
    });

    it('should not register a new mentor if email is not provided', async () => {
      const response = await request(app)
        .post(url)
        .send({
          ...user,
          email: '',
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });

    it('should not register a new mentor if firstName is not provided', async () => {
      const response = await request(app)
        .post(url)
        .send({
          ...user,
          firstName: '',
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'First name is required');
    });

    it('should not register a new mentor if lastName is not provided', async () => {
      const response = await request(app)
        .post(url)
        .send({
          ...user,
          lastName: '',
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Last name is required');
    });

    it('should not register a new mentor if track is not provided', async () => {
      const response = await request(app)
        .post(url)
        .send({
          ...user,
          track: '',
        });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message');
    });

    describe('Mentor registration: password validation', () => {
      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...user,
            password: 'password',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'Password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...user,
            password: 'PASSWORD',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'Password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...user,
            password: 'Password',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'Password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...user,
            password: 'Password1',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'Password must contain uppercase, lowercase, number and special character'
        );
      });
    });
  });
});
