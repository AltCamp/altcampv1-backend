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
    expect(response.body).toHaveProperty('msg', 'Student created successfully');
    expect(response.body).toHaveProperty('account');
    expect(response.body).toHaveProperty('student');
    expect(response.body).toHaveProperty('token');
    expect(response.body.account).toEqual(
      expect.objectContaining({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        track: user.track,
        owner: response.body.student._id,
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(response.body.student).toEqual(
      expect.objectContaining({
        matric: user.matric,
        stack: user.stack,
        gender: user.gender,
        _id: expect.any(String),
      })
    );
    expect(response.body.token).toEqual(expect.any(String));

    // Verify token
    const token = response.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toEqual(
      expect.objectContaining({
        id: response.body.account._id,
        firstname: user.firstname,
        lastname: user.lastname,
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
      expect(response.body).toHaveProperty('msg', 'Student Exist already!');
    });

    it('should not register a new student if email is invalid', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        email: 'wrong@mail',
      });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Not a valid email address');
    });

    it('should not register a new student if password is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        password: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Password is required');
    });

    it('should not register a new student if email is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        email: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Email is required');
    });

    it('should not register a new student if firstname is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        firstname: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Firstname is required');
    });

    it('should not register a new student if lastname is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        lastname: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Lastname is required');
    });

    it('should not register a new student if track is not provided', async () => {
      const response = await api.post('/auth/student').send({
        ...user,
        track: '',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Track is required');
    });

    describe('Student registration: password validation', () => {
      it('should not register a new student if password does not contain uppercase, lowercase, number and special character', async () => {
        const response = await api.post('/auth/student').send({
          ...user,
          password: 'password',
        });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'msg',
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
          'msg',
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
          'msg',
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
          'msg',
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
          'msg',
          'Password must be at least 8 characters long'
        );
      });
    });
  });
});
