// const { createLogger, transports } = require('winston');
// require('winston-mongodb');

const winston = require('winston');

module.exports = function (err, req, res, next) {

    // let logger = createLogger({
    //     level: 'error',
    //     transports: [
    //         new transports.Console(),
    //         new transports.File({ filename: 'combined.log' })
    //     ]
    // });
    // logger.add(new transports.MongoDB(
    //     {db: 'mongodb://localhost/aiculus',
    //         collection: 'logs',
    //         level: 'error',
    //         useNewUrlParser: true}));
    // logger.error(err.message, err);

    winston.log('error', err.stack);
    //error, warn, info, verbose, debug, silly


    res.status(500).send(err.message);
};