const { MongoMemoryServer } = require('mongodb-memory-server');

async function run() {
  const mongod = await MongoMemoryServer.create();

  mongod.getUri();

  await mongod.stop();
}

run();
