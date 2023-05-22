const jwt = require('jsonwebtoken');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');

describe('Auth: Student registration', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbCleanUP();
    await dbDisconnect();
  });

  const user = helper.generateFreshStudentData();

  it('should register a new student and return a valid JWT', async () => {
    const response = await api.post('/auth/student').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('statusCode', response.status);
    expect(response.body).toHaveProperty(
      'message',
      'Student created successfully'
    );
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        track: user.track,
        accountType: 'Student',
        owner: expect.objectContaining({
          _id: expect.any(String),
        }),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(response.body.data.token).toEqual(expect.any(String));

    // Verify token
    const token = response.body.data.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toEqual(
      expect.objectContaining({
        id: response.body.data.user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    );
  });

  describe('Student registration: input validation', () => {
    afterEach(async () => {
      await dbCleanUP();
    });

    it('should not register a new student if email already exists', async () => {
      const response = await api.post('/auth/student').send(user);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Student already exists!'
      );
    });

    it('should not register a new student if email is invalid', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        email: 'wrong@mail',
      });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty(
        'message',
        'Not a valid email address'
      );
    });

    it('should not register a new student if password is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        password: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Password is required');
    });

    it('should not register a new student if email is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        email: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });

    it('should not register a new student if firstname is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        firstName: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Firstname is required');
    });

    it('should not register a new student if lastname is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        lastName: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Lastname is required');
    });

    it('should not register a new student if track is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        track: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Track is required');
    });

    describe('Student registration: password validation', () => {
      it('should not register a new student if password does not contain uppercase, lowercase, number and special character', async () => {
        const response = await api.post('/auth/student').send({
          ...user,
          password: 'password',
        });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new student if password does not contain uppercase, lowercase, number and special character and is less than 8 characters', async () => {
        const response = await api.post('/auth/student').send({
          ...user,
          password: 'PASSWORD',
        });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new student if password does not contain uppercase, lowercase, number and special character', async () => {
        const response = await api.post('/auth/student').send({
          ...user,
          password: 'Password',
        });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new student if password does not contain uppercase, lowercase, number and special character', async () => {
        const response = await api.post('/auth/student').send({
          ...user,
          password: 'Password1',
        });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new student if password is less than 8 characters', async () => {
        const response = await api.post('/auth/student').send({
          ...user,
          password: 'Pas1*',
        });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'message',
          'Password must be at least 8 characters long'
        );
      });
    });
  });
});
