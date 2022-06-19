const mongoose = require('mongoose')
const Joi = require('joi')
const {ProductSchema} = require('./Products')

const OrderSchema = new mongoose.Schema({
    orderedAt : {type:Date,default:Date.now},
    quantity:{type:Number,required:true},
    cost:{type:Number,required:true},
    name:{type:String,required:true},
    image:{type:String,required:true}
})

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    orders:[{type:OrderSchema}],
    wishlist:[{type:ProductSchema}],
    isAdmin:{type:Boolean,default:false}
})

const User = mongoose.model('User',UserSchema)
const Order = mongoose.model('Order',OrderSchema)

const Schema1 = Joi.object({
    name:Joi.string().min(5).required(),
    email:Joi.string().email().min(10).required(),
    password:Joi.string().min(10).required()
})

const Schema2 = Joi.object({
    email:Joi.string().email().min(10).required(),
    password:Joi.string().min(10).required()
})

const Schema3 = Joi.object({
    userid:Joi.string().required(),
    productid:Joi.string().required(),
    quantity:Joi.number().required(),
    cost:Joi.number().required()
})

const Schema4 = Joi.object({
    userid:Joi.string().required(),
    productid:Joi.string().required(),
})

module.exports = {User,Order,Schema1,Schema2,Schema3,Schema4}