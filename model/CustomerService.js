const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({
    textMessage:{
        type:String,
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        default:"6424d5dc7289d146ee9b735e"
    },

} , {timestamps:true})


module.exports = mongoose.model("CustomerChat" , serviceSchema)