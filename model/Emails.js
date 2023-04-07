const mongoose = require("mongoose")

const emailSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
        unique:true
    }
} , {timestamps:true})


module.exports = mongoose.model("Emails" , emailSchema)