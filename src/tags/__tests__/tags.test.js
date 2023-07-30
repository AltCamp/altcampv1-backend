const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../../../test/testHelper');
const TagsService = require('../tagsService');

let token;

beforeAll(async () => {
  // connect to database
  await dbConnect();

  // get 'dummy' entities from helper
  const { accounts } = helper;

  // create entities in database
  await Promise.all(accounts);
});

describe('createTags', () => {
  it('should create new tags', async () => {
    const user = helper.accountsAsJson.find(
      (user) => user.emailIsVerified === true
    );
    const tagsService = new TagsService();

    const tags = ['tag1', 'tag2', 'tag3'];
    const createdBy = user._id;

    const createdTags = await tagsService.createTags(tags, createdBy);

    expect(createdTags).toHaveLength(tags.length);
    expect(createdTags[0]).toHaveProperty('_id');
    expect(createdTags[0]).toHaveProperty('name', 'tag1');
    expect(createdTags[1]).toHaveProperty('_id');
    expect(createdTags[1]).toHaveProperty('name', 'tag2');
    expect(createdTags[2]).toHaveProperty('_id');
    expect(createdTags[2]).toHaveProperty('name', 'tag3');
  });
});

describe('getTags', () => {
  it('should retrieve a list of tags', async () => {
    const user = helper.accountsAsJson.find(
      (user) => user.emailIsVerified === true
    );
    await login(user);

    const tagsData = [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }];

    const response = await api
      .get('/tags')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const tagNames = response.body.data.map((tag) => tag.name);

    expect(response.body.data).toHaveLength(tagsData.length);
    expect(tagNames).toContain('tag1');
    expect(tagNames).toContain('tag2');
    expect(tagNames).toContain('tag3');
    expect(tagNames).not.toContain('tagUnknown');
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
