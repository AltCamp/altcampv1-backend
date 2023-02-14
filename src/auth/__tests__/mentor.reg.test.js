const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../../app');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');

describe('Auth: Mentor registration', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbCleanUP();
    await dbDisconnect();
  });

  const user = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@test.com',
    password: 'Securepassword1@',
    track: 'SRE',
    specialization: 'DevOps',
    yearsOfExperience: 5,
  };

  it('should register a new mentor and return a valid JWT', async () => {
    const response = await request(app).post('/auth/mentor').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg', 'Mentor created successfully');
    expect(response.body).toHaveProperty('account');
    expect(response.body).toHaveProperty('mentor');
    expect(response.body).toHaveProperty('token');
    expect(response.body.account).toEqual(
      expect.objectContaining({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        track: user.track,
        accountType: 'Mentor',
        owner: response.body.mentor._id,
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(response.body.mentor).toEqual(
      expect.objectContaining({
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        _id: expect.any(String),
      })
    );
    expect(response.body.token).toEqual(expect.any(String));

    // Verify token
    const token = response.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toEqual(
      expect.objectContaining({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        track: user.track,
        owner: response.body.mentor._id,
        accountType: 'Mentor',
      })
    );
  });

  describe('Mentor registration: input validation', () => {
    afterEach(async () => {
      await dbCleanUP();
    });

    it('should not register a new mentor if email already exists', async () => {
      const response = await request(app).post('/auth/mentor').send(user);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('msg', 'Mentor already exists!');
    });

    it('should not register a new mentor if password is not provided', async () => {
      const response = await request(app)
        .post('/auth/mentor')
        .send({
          ...user,
          password: '',
        });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Password is required');
    });

    it('should not register a new mentor if email is not provided', async () => {
      const response = await request(app)
        .post('/auth/mentor')
        .send({
          ...user,
          email: '',
        });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Email is required');
    });

    it('should not register a new mentor if firstname is not provided', async () => {
      const response = await request(app)
        .post('/auth/mentor')
        .send({
          ...user,
          firstname: '',
        });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Firstname is required');
    });

    it('should not register a new mentor if lastname is not provided', async () => {
      const response = await request(app)
        .post('/auth/mentor')
        .send({
          ...user,
          lastname: '',
        });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Lastname is required');
    });

    it('should not register a new mentor if track is not provided', async () => {
      const response = await request(app)
        .post('/auth/mentor')
        .send({
          ...user,
          track: '',
        });
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Track is required');
    });

    describe('Mentor registration: password validation', () => {
      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post('/auth/mentor')
          .send({
            ...user,
            password: 'password',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'msg',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post('/auth/mentor')
          .send({
            ...user,
            password: 'PASSWORD',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'msg',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post('/auth/mentor')
          .send({
            ...user,
            password: 'Password',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'msg',
          'password must contain uppercase, lowercase, number and special character'
        );
      });

      it('should not register a new mentor if password does not contain uppercase,lowercase, number and special character', async () => {
        const response = await request(app)
          .post('/auth/mentor')
          .send({
            ...user,
            password: 'Password1',
          });
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
          'msg',
          'password must contain uppercase, lowercase, number and special character'
        );
      });
    });
  });
});
