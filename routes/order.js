const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const staff = require("../middleware/staff");
var { Order, validateOrder } = require("../models/order");
var { Product } = require("../models/product");

// get all order details
// ADMIN ONLY!!
router.get("/all", [auth, admin], async (req, res) => {
  const orders = await Order.find().sort("-createdAt");
  res.send(orders);
});

// get all orders of a specific user
// ADMIN AND STAFF ACCESS
router.get("/user/:username", [auth, staff], async (req, res) => {
  const orders = await Order.find({
    username: req.params.username
  }).sort("-createdAt");

  if (!orders) return res.status(400).send("No orders found with this ID.");

  res.send(orders);
});

// get all orders of the current user
//
router.get("/me", auth, async (req, res) => {
  const orders = await Order.find({
    username: req.body.username
  }).sort("-createdAt");

  if (!orders)
    return res.status(400).send("No orders found with current user.");

  res.send(orders);
});

// create new order
router.post("/new", auth, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = new Order({
    username: req.body.username,
    $push: { items: { $each: req.body.items } },
    total: req.body.total
  });
  await order.save();

  res.send(order);
});

module.exports = router;
