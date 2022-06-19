const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Joi = require('joi')
const router = express.Router();
const {User,Order,Schema1,Schema2,Schema3,Schema4} = require('../models/User')
const {Product} = require('../models/Products')

router.post('/authenticate/signin',async (req,res)=>{
    console.log(req.body)
    const {error} = Schema2.validate(req.body)
    
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }

   
        const user = await User.findOne({email:req.body.email,password:req.body.password})
        if(user){
          res.status(200).send(user)
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
        res.status(400).send('User with same Email already exists')
        return
   }
})

router.post("/buy", async (req, res) => {
     const { error } = Schema3.validate(req.body);
     if (error) {
       res.status(400).send(error);
     }
   
   
     
     try {
       let product = await Product.findByIdAndUpdate(req.body.productid,{
         $inc:{
           quantity:req.body.quantity
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
       res.status(200).send(user.orders)
     } catch (error) {
       res.status(400).send(error)
     }
   
   });

   router.post("/wishlist", async (req, res) => {
     const { error } = Schema4.validate(req.body);
     if (error) {
       res.status(400).send(error);
     }
     
     try {
          const product = await Product.findById(req.body.productid);
          let user = await User.findById(req.body.userid)
             user.wishlist.push(product)
             await user.save()
             res.status(200).send(product)
     } catch (error) {
          res.status(400).send(error);
     }
   
   });
   
   
module.exports = {userRoutes:router}