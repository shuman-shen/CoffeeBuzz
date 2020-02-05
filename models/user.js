const config = require("config");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

//Schema
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      trim: true
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
      unique: true // TODO: check the usage
    },
    password: {
      type: String, // todo: to encrypt
      minlength: 3,
      maxlength: 1024,
      //match: /^[a-zA-Z0-9]{3,20}$/,
      required: true
    },
    //DOB: String, // why need this?? #OPTIONAL
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      // RegExp for email address
      match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
    role: {
      type: String,
      enum: ["customer", "staff", "manager"],
      default: "customer"
    }
  },
  { timestamps: true }
);

function validateRegister(user) {
  const schema = {
    firstName: Joi.string()
      .min(1)
      .max(100)
      .required(),
    lastName: Joi.string()
      .min(1)
      .max(100)
      .required(),
    username: Joi.string()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string()
      .min(5)
      .max(100)
      .required()
      .email(),
    role: Joi.string()
  };

  return Joi.validate(user, schema);
}

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      username: this.username,
      admin: this.admin
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

function validateChange(user) {
  const schema = {
    firstName: Joi.string()
      .min(1)
      .max(100),
    lastName: Joi.string()
      .min(1)
      .max(100)
    //    phone: Joi.string(),
    //    DOB: Joi.string(),
  };

  return Joi.validate(user, schema);
}

exports.User = mongoose.model("User", userSchema);
exports.validateRegister = validateRegister;
exports.validateChange = validateChange;
