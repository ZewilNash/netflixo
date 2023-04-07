const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    story:[
        {
            url:{
                type:String
            },
            type:{
                type:String
            },
            duration:{
                type:Number
            },
            header:{
        
                heading:{
                    type:String
                },
                subheading:{
                    type:String
                },
                profileImage:{
                    type:String
                }
            },
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    likes:[mongoose.Schema.Types.ObjectId]
},{timestamps:true})


module.exports = mongoose.model("Story" , storySchema)