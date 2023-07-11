const mongoose = require('mongoose');
const { DB_CONNECTED, ERR_DB_CONNECTION } = require('../constant');

const connectDatabase = async (url) => {
  mongoose.set('strictQuery', true);
  mongoose.set('strictPopulate', false);
  try {
    const connect = await mongoose.connect(url);
    logger.info(`${DB_CONNECTED} ${connect.connection.host}`);
  } catch (err) {
    logger.error(`${ERR_DB_CONNECTION} ${err.message}`);
  }
};

module.exports = connectDatabase;
