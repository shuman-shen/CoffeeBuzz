const Joi = require("@hapi/joi");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
var { User, validateRegister, validateChange } = require("../models/user");

// router.get("/", function (req, res) {
//     res.send("This is the user page");
// });

//return all users and full name
router.get("/all", [auth, admin], async (req, res) => {
  const users = await User.find().sort("username");
  let output = [];
  users.forEach(users => {
    output.push(users["username"]);
  });
  res.send(output);
});

// get user information
router.get("/me", auth, async (req, res) => {
  let user = await User.findOne({ username: req.user.username }).select(
    "-password"
  );

  res.send(user);
});

router.post("/register", async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists");

  user = new User(
    _.pick(req.body, [
      "username",
      "password",
      "email",
      "firstName",
      "lastName",
      "role"
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  // const token = jwt.sign({
  //     username: user.username,
  //     admin: user.admin }, config.get('jwtPrivateKey'));

  res
    .header("x-auth-token", token)
    .send(
      _.pick(user, [
        "_id",
        "firstName",
        "lastName",
        "username",
        "email",
        "role"
      ])
    );
});

// change user details
router.put("/username/:username", auth, async (req, res) => {
  const { error } = validateChange(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    {
      // ATTENTION: if any field is empty, null is returned to database
      firstName: req.body.firstName,
      lastName: req.body.lastName
    },
    { new: true }
  );

  if (!user)
    return res
      .status(404)
      .send("The user with the given username was not found.");

  res.send(user);
});

router.put("/changePassword", auth, async (req, res) => {
  // Update password

  // TODO: CHECK NOT NULL
  const { error } = validateNewPass(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("User doesn't exist");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password.");

  const salt = await bcrypt.genSalt(10);
  const saltedPass = await bcrypt.hash(req.body.newPassword, salt);

  user = await User.findOneAndUpdate(
    { username: req.body.username },
    { password: saltedPass },
    { new: true }
  );

  if (!user) return res.status(404).send("User not found.");

  // update jwt payload
  const token = user.generateAuthToken();
  res.send(token);
});

function validateNewPass(req) {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string()
      .min(3)
      .max(30)
      .required(),
    newPassword: Joi.string()
      .min(3)
      .max(30)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
