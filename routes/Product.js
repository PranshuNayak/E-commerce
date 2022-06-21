const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {auth} = require('../middleware/auth')

const Joi = require("joi");
const router = express.Router();
const { Product, Schema1, Schema3,Schema4 } = require("../models/Products");

router.post("/",async (req,res)=>{
  
  const schema = Joi.object({
    id:Joi.string().required()
  })

  const {error} = schema.validate(req.body)
  if(error){
    res.status(400).send(error.details[0].message)
    return
  }

  try {
    const product = await Product.findById(req.body.id)
    res.status(200).send(product)
  } catch (error) {
    res.status(400).send("Product not found")
  }
  

})

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

router.put("/", auth,async (req, res) => {
  const schema = Joi.object({
    productid:Joi.string().required(),
    userid:Joi.string().required(),
    isAdmin:Joi.boolean().required(),
    modified:Joi.object().min(1).required()
  })
  

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }
  

  if(!req.body.isAdmin){
    res.send(401).send('You are not allowed to perform this operation')
  }
  

  try {
    let product = await Product.findById(req.body.productid)
    const keys = Object.keys(req.body.modified)
    const values = Object.values(req.body.modified)
    for(let i=0;i<keys.length;i++){
      product[keys[i]] = values[i]
    }
    await product.save()
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/", auth,async (req, res) => {
  const schema = Joi.object({
    productid:Joi.string().required(),
    userid:Joi.string().required(),
    isAdmin:Joi.boolean().required()
  })
  const { error } = Schema4.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }

  if(!req.body.isAdmin){
    res.send(401).send('You are not allowed to perform this operation')
  }
  try {
    let product = await Product.findByIdAndRemove(req.body.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { productRoutes: router };
