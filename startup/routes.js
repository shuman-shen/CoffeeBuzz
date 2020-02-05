const express = require('express');
const cors         = require('cors');
//const bodyParser = require('body-parser');
const error = require('../middleware/error');

//include the routes file
const user = require("../routes/user");
const auth = require("../routes/auth");
const contract = require("../routes/contract");
const verification = require("../routes/verification");
const transaction = require("../routes/transaction");
const friend = require("../routes/friend");

module.exports = function (app) {

    app.use(express.json());

    // TODO: CORS config for production
    app.use(cors());
    //app.use(bodyParser.json());
    //app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/api/users", user);
    app.use("/api/auth", auth);
    app.use("/api/contracts", contract);
    app.use("/api/verifications", verification);
    app.use("/api/transactions", transaction);
    app.use("/api/friends", friend);

    // error handling middleware
    app.use(error);

};