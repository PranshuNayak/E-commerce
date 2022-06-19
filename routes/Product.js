const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Joi = require("joi");
const router = express.Router();
const { Product, Schema1, Schema3,Schema4 } = require("../models/Products");

router.get("/:category", async (req, res) => {
  
  const category = req.params.category

  try {
    const products = await Product.find({category:category});
    res.status(200).send(products);
    return;
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  
  const { error } = Schema1.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }

  let product = await Product.find({
    name: req.body.name,
    category: req.body.category,
  });
  if (product.length) {
    res.status(400).send({ message: "This product already exists" });
    return;
  }
  console.log(req.body)
  try {
    let product = new Product(req.body);
    await product.save();
    res.status(200).send(product);
    return;
  } catch (error) {
    res.status(400).send({ message: "Product validation failed " });
  }
});

router.put("/", async (req, res) => {
  const { error } = Schema3.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }

  try {
    let product = await Product.findByIdAndUpdate(req.body.id, {
      $set: {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,
      },
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/", async (req, res) => {
  const { error } = Schema4.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }

  try {
    let product = await Product.findByIdAndRemove(req.body.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { productRoutes: router };
