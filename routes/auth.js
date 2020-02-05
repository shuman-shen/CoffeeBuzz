const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const _ = require("lodash");
const express = require("express");
const router = express.Router();
var { User } = require("../models/user");




router.post("/", async (req, res) => {

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send('Invalid username or password.');

        const validPass = await bcrypt.compare(req.body.password, user.password);

        if(!validPass) return res.status(400).send('Invalid username or password.');

        // setting jwt payload

        const token = user.generateAuthToken();

        res.send(token);


});


function validate(req) {
    const schema = {
        username: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(3).max(30).required()
    };

    return Joi.validate(req, schema);
}



module.exports = router;