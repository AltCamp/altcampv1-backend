const mongoose = require('mongoose');
const logger = require('./logger');
const connectDatabase = async (url) => {
  mongoose.set('strictQuery', true);
  mongoose.set('strictPopulate', false);
  try {
    const connect = await mongoose.connect(url);
    logger.info(`Successfully connected to ${connect.connection.host}`);
  } catch (err) {
    logger.error('A problem occured while connecting to the database', err);
  }
};

module.exports = connectDatabase;
