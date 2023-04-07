const Service = require("../model/CustomerService")
const User = require("../model/UserModel")

module.exports.sendMessage = async (req , res) => {
    try {
        const {from , to} = req.params
        const {textMessage} = req.body
        if(!textMessage){
            return res.send({
                success:false,
                message:"Please Type A Message Or Send An Image"
            })
        }

        const checkFromUser = await User.findById(from)
        const checkToUser = await User.findById(to)

        if(!checkFromUser || !checkToUser){
            return res.send({
                success:false,
                message:"User Not Found With this id"
            })
        }
  
           const message =  await Service({
                textMessage:textMessage,
                from:from,
                to:to
            }).save()
        

        res.send({
            success:true,
            messageFlag:"Message Saved Successfully",
            message
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Sending Messages"
        })
    }
}

module.exports.getUsersMessages = async (req , res) => {
    try {
        const {from , to} = req.params
        const messages = await Message.find({ $or:[ {to:to , from:from}, {to:from , from:to}]})

        res.status(200).send({
            success:true,
            messages
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Messages"
        })
    }
}