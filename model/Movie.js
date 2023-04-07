const mongoose = require("mongoose")

const MovieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    image:{
        data:Buffer,
        contentType:String
    },
    duration:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    video:{
        type:String
    },
    downloadUrl:{
        type:String
    },
    casts:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Casts"
        }
    ]
} , {timestamps:true})


module.exports = mongoose.model("Movies" , MovieSchema)