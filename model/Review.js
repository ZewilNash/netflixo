const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:true
    },
    rate:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movies"
    },

})

module.exports = mongoose.model("Reviews" , reviewSchema)