var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    size: {
      type: String
    },
    stock: {
      type: Number
    },
    price: {
      type: Number
    }
  },
  { timestamps: true }
);

function validate(product) {
  const schema = {
    productName: Joi.string()
      .min(3)
      .required(),
    size: Joi.string().min(3),
    stock: Joi.number().min(0),
    price: Joi.number().min(0)
  };

  return Joi.validate(product, schema);
}

exports.Product = mongoose.model("Product", productSchema);
exports.validate = validate;
