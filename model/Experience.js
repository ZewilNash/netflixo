const mongoose = require("mongoose")

const experienceSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    experience:{
        type:String,
        required:true
    },
    theme:{
        data:Buffer,
        contentType:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    comments:[
        {
            comment:{
                type:String,
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Users"
            }
        }
    ],
    likes:[mongoose.Schema.Types.ObjectId]
} , {timestamps:true})

module.exports = mongoose.model("Experience" , experienceSchema)