const mongoose = require('mongoose');
const logger = require('./logger')
const connectDatabase = async (url) => {
    try {
        const connect = await mongoose.connect(url)
        logger.info(`connect.connection.host ${connect.connection.port}`)
    }
    catch (err) {
        logger.error('A problem occured while connecting to the datbase', err)
    }
};

// exports.connectDb = async (URI) => {
//     try {
//         const conn = await mongoose.connect(URI)
//         logger.info(`Successfully connected to ${conn.connection.host}`)
//     } catch (error) {
//         logger.error('A problem occured connecting to the database', error)
//     }
// }

module.exports = connectDatabase;