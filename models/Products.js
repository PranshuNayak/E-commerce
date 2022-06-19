const mongoose = require('mongoose')
const Joi = require('joi')

const categoryValidator = (category)=>{
    const categories = ['Electronic','Basic','Book','Beauty','Furniture']
    for(let i=0;i<categories.length;i++){
      if(categories[i]===category)
      return true
    }
    return false
}

const ProductSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true},
    discount:{type:Number,default:0},
    category:{type:String,
    validate:{
        validator: function(category){
            return category && categoryValidator(category)
        },
        message:'This category is not available'
    }
    },
    image:{type:String,required:true}
})

const Product = mongoose.model('Product',ProductSchema)

const Schema1 = Joi.object({
    name:Joi.string().min(5).required(),
    description:Joi.string().min(20).required(),
    quantity:Joi.number().required(),
    category:Joi.string().required(),
    image:Joi.string().required(),
    price:Joi.number().required()
})

const Schema2 = Joi.object({
    id:Joi.string().required()
})

const Schema3 = Joi.object({
    id:Joi.string().required(),
    name:Joi.string().min(5).required(),
    description:Joi.string().min(50).required(),
    quantity:Joi.number().required(),
    category:Joi.string().min(5).required(),
    image:Joi.string().required(),
    price:Joi.number().required()
})

const Schema4 = Joi.object({
    id:Joi.string().required()
})




module.exports = {Product,ProductSchema,Schema1,Schema2,Schema3,Schema4}
