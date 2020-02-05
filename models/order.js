var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
var { productSchema } = require("./product");

var orderSchema = new mongoose.Schema(
  {
    // Assume contract can only be initiated by PAYER
    username: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true
    },
    items: [
      {
        produt: productSchema,
        amount: Number
      }
    ],
    total: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
  const schema = {
    username: Joi.string().required(),
    items: Joi.array().items({
      productId: Joi.objectId().required(),
      amount: Joi.number()
        .required()
        .min(0)
    }),
    total: Joi.number()
      .required()
      .min(0)
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validateOrder = validateOrder;
