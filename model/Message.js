const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    textMessage:{
        type:String,
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },

    

} , {timestamps:true})


module.exports = mongoose.model("Messages" , messageSchema)