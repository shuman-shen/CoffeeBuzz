const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {


    process.on("unhandledRejection", (ex) => {
        throw ex; // throw to winston.handleExceptions
    });

    //TODO: WINSTON CONFIG: PRINT COLORIZE AND SIMPLE FORMAT

    const file_combined = new winston.transports.File({ filename: 'combined.log'});
    const file_exceptions = new winston.transports.File({ filename: 'exceptions.log'});
    const console = new winston.transports.Console();
    const db_path = new winston.transports.MongoDB({db: 'mongodb://localhost/aiculus',
        collection: 'logs',
        level: 'error',
        useNewUrlParser: true});

    winston.add(console);
    winston.add(file_combined);
    winston.add(db_path);
    winston.exceptions.handle(console, file_exceptions);

};