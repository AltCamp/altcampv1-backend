const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

let mongoServer = null;

exports.dbConnect = async function () {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
  const uri = mongoServer.getUri();

  const mongooseOpt = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.set('strictQuery', true);
  mongoose.set('strictPopulate', false);

  mongoose.connect(uri, mongooseOpt);
};

exports.dbCleanUP = async () => {
  if (mongoServer) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
};

exports.dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
