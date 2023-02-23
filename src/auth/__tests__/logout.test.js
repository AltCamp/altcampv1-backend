// test logout route
const request = require('supertest');
const app = require('../../../app');
const auth = require('../../../middleware/authenticate');
const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const helper = require('../../../test/testHelper');

describe('Auth: Logout', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbCleanUP();
    await dbDisconnect();
  });

  // protected route
  app.get('/me', auth.verifyUser, (req, res) => {
    res.status(200).json({
      msg: 'You are logged in',
      user: req.user,
    });
  });
  // git delete branch command
  //  branch-name

  const user = helper.generateFreshMentorData();

  it('should return 401 Unauthorized when accessing a protected route after logging out', async () => {
    const agent = request.agent(app);
    // register a user
    const regRes = await agent.post('/auth/mentor').send(user);
    expect(regRes.status).toBe(201);

    // login the user
    const loginRes = await agent.post('/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);

    // logout the user
    const logoutRes = await agent.post('/auth/logout');
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body).toHaveProperty('msg', 'You have been logged out');

    // verify the user is logged out
    const res2 = await agent.get('/me');
    expect(res2.status).toBe(401);
  });
});
