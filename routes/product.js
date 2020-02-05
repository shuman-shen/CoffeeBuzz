const Joi = require("@hapi/joi");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
var { Product, validateProduct } = require("../models/product");

router.get("/all", auth, async (req, res) => {
  //find all products

  const products = await Product.find().sort({ createdAt: -1 });

  if (!products)
    return res.status(404).send("No contract under this user is found.");

  res.send(products);
});

router.get("/id/:id", auth, async (req, res) => {
  //find all contracts by payer

  const products = await Product.find({
    _id: req.params.id
  });

  if (!products) return res.status(404).send("No such product found.");

  res.send(products);
});

router.post("/new", auth, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const name = await Product.findOne({ productName: req.body.productName });
  if (name)
    return res.status(400).send("Duplicated. Product already in the database.");

  const product = new Product({
    productName: req.body.productName,
    size: req.body.size,
    stock: req.body.stock,
    price: req.body.price
  });
  await product.save();

  res.send(product);
});

// change product stock
// ADMIN ONLY.

router.put("/stock/:id", [auth, admin], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await product.findOne({ _id: req.body.id });
  if (!product) return res.status(400).send("Product not found");

  const product = await Product.findOneAndUpdate(
    { _id: req.body.id },
    {
      stock: req.body.stock
    },
    { new: true }
  );

  res.send(product);
});

// change product stock
// ADMIN ONLY.

router.put("/size/:id", [auth, admin], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await product.findOne({ _id: req.body.id });
  if (!product) return res.status(400).send("Product not found");

  const product = await Product.findOneAndUpdate(
    { _id: req.body.id },
    {
      size: req.body.size
    },
    { new: true }
  );

  res.send(product);
});

// change product price
// ADMIN ONLY.

router.put("/price/:id", [auth, admin], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await product.findOne({ _id: req.body.id });
  if (!product) return res.status(400).send("Product not found");

  const product = await Product.findOneAndUpdate(
    { _id: req.body.id },
    {
      price: req.body.price
    },
    { new: true }
  );

  res.send(product);
});

// delete product
router.delete("/delete/:id", [auth, admin], async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

module.exports = router;
