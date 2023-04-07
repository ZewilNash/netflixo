 const mongoose = require("mongoose")

 const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        data:Buffer,
        contentType:String
    },
    coverImage:{
        data:Buffer,
        contentType:String
    },
    role:{
        type:Number,
        default:0
    },

    stories:[mongoose.Schema.Types.ObjectId],

    favourites:[mongoose.Schema.Types.ObjectId]

 } , {timestamps:true})

 module.exports = mongoose.model("Users" , userSchema)