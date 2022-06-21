const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const Joi = require('joi')
const router = express.Router();
const {User,Order,Schema1,Schema2,Schema3,Schema4} = require('../models/User')
const {Product} = require('../models/Products')
const {auth} = require('../middleware/auth')
require('dotenv').config()

router.post('/authenticate/signin',async (req,res)=>{
    
    const {error} = Schema2.validate(req.body)
    
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }

   
        let user = await User.findOne({email:req.body.email,password:req.body.password})
        if(user){
          const token = jwt.sign({_id:user._id,isAdmin:user.isAdmin},process.env.JWT_PRIVATE_KEY)
          const admin = user.isAdmin
          user = _.pick(user,['name','email','orders','wishlist'])
          res.status(200).json({user,token,admin:admin})
          return
        }
        res.status(400).send("Invalid credentials")
        return
   

})

router.post('/authenticate/signup',async (req,res)=>{
    
    const {error} = Schema1.validate(req.body)
    
    if(error){
        res.status(400).send(error)
        return
    }

   try {
        const user = new User(req.body)
        await user.save()
        res.status(200).send('You have been successfully registered')
        return
   } catch (error) {
        res.status(400).send('Please use a different email')
        return
   }
})

router.post("/buy",auth ,async (req, res) => {
    const schema = Joi.object({
    userid:Joi.string().required(),
    productid:Joi.string().required(),
    quantity:Joi.number().required(),
    cost:Joi.number().required(),
    isAdmin:Joi.boolean().required(),
   })


     const { error } = schema.validate(req.body);
     if (error) {
       res.status(400).send(error);
     }
   
   
     
     try {
       let product = await Product.findByIdAndUpdate(req.body.productid,{
         $inc:{
           quantity:-Number(req.body.quantity)
         }
       });
       let user = await User.findById(req.body.userid)
       let order = new Order({
          quantity:req.body.quantity,
          cost:req.body.cost,
          name:product.name,
          image:product.image
       })
       user.orders.push(order)
       await user.save()
       res.status(200).send(order)
     } catch (error) {
       res.status(400).send(error)
     }
   
   });

   router.post("/wishlist", auth,async (req, res) => {
    
     const schema = Joi.object({
      userid:Joi.string().required(),
      productid:Joi.string().required(),
      isAdmin:Joi.boolean().required(),
     })

     const {error} = schema.validate(req.body)
     if (error) {
       res.status(400).send(error);
       return
     }
     console.log(req.body)
     try {
          let product = await Product.findById(req.body.productid);
          product = _.pick(product,['image','name','_id','category'])
          let user = await User.findById(req.body.userid)
             user.wishlist.push(product)
             await user.save()
             res.status(200).send(product)
             return
     } catch (error) {
          res.status(400).send(error);
     }
   
   });
   
   
module.exports = {userRoutes:router}