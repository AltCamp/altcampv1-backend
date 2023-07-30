const { dbConnect, dbCleanUP, dbDisconnect } = require('../../../test/test.db');
const app = require('../../../app');
const supertest = require('supertest');
const api = supertest(app);
const { Track } = require('../../../model');

// Sample data to populate the test database
const sampleTracks = [
  { track: 'Track 1' },
  { track: 'Track 2' },
  { track: 'Track 3' },
];

const url = '/tracks';

beforeAll(async () => {
  await dbConnect();
  await Track.create(sampleTracks);
});

describe('GET /api/tracks', () => {
  it('should get all tracks from the database', async () => {
    const response = await api.get(url);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(sampleTracks.length);
    expect(response.body.data).toEqual(
      expect.arrayContaining(
        sampleTracks.map((track) => expect.objectContaining(track))
      )
    );
  });
});

afterAll(async () => {
  await dbCleanUP();
  await dbDisconnect();
});
