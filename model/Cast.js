const mongoose = require("mongoose")

const castSchema = new mongoose.Schema({
    castName:{
        type:String,
        required:true
    },
    castImage:{
        data:Buffer,
        contentType:String 
    },
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movies"
    }
}, {timestamps:true})

module.exports = mongoose.model("Casts" , castSchema)