const redis = require('redis');
const { redis: redisConfig } = require('../../../config');
const { REDIS } = require('../../../constant');
const redisClient = redis.createClient({
  url: redisConfig.url,
});

redisClient.on('error', function (err) {
  logger.error(`${REDIS.CONNECTION_ERROR}`, err);
});

const { NODE_ENV } = process.env;
if (NODE_ENV.toLowerCase() !== 'test') {
  setInterval(function () {
    logger.info(`${REDIS.KEEPING_ALIVE}`);
    redisClient.set('ping', 'pong');
  }, 1000 * 60 * 4);
}

global.cache = redisClient;
module.exports = redisClient;
