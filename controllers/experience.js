const User = require("../model/UserModel")
const Experience = require("../model/Experience")
const fs = require("fs")

module.exports.createExperience = async (req , res) => {
    try {
        const {id} = req.params
        const {title , experience} = req.fields
        const {theme} = req.files
        const user = await User.findById(id)
        
        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        if(!title || !theme || !experience){
            return res.send({
                success:false,
                message:"Please Fill All Required Fields"
            })
        }

        const checkDuplicateTitle = await Experience.findOne({title})

        if(checkDuplicateTitle){
            return res.send({
                success:false,
                message:"Duplicated Title Please Pick New Title"
            })
        }

        await Experience({
            title,
            experience,
            user:id,
            theme:{data:fs.readFileSync(theme.path) , contentType:theme.type}
        }).save()

        res.status(201).send({
            success:true,
            message:"Experience Posted Successfully"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Creating User Experience"
        })
    }
}


module.exports.getExperiences = async (req , res) => {
    try {
        const experiences = await Experience.find({}).select("-theme")
        res.status(200).send({
            success:true,
            experiences
        })
    }catch(error){
       res.status(500).send({
            success: false,
            error,
            message: "Error In Getting  Experiences"
        })
    }
}

module.exports.searchExperience = async (req , res) => {
    try {
        const {value} = req.query
        if(!value){
            return res.send({
                success:false,
                message:"Please Provide The Search Value"
            })
        }

        const experiences = await Experience.find({title:{$regex:'^' + value, $options:"i"}}).select("-theme")

        res.status(200).send({
            success:true,
            experiences
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Searching Experiences"
        })
    }
}

module.exports.getExperienceTheme = async (req , res) => {
    try {
        const {id} = req.params
        const theme = await Experience.findById(id).select("theme")
        if(theme.theme.data){
            res.set("Content-Type", theme.theme.contentType)
            return res.status(200).send(theme.theme.data)
        }
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Experience Theme"
        })
    }
}

module.exports.getExperiencesForUser = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)
        
        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        const experiences = await Experience.find({user:id})

        res.status(200).send({
            success:true,
            experiences
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting  Experiences For User"
        })
    }
}

module.exports.comment = async (req , res) => {
    try {
        const {id , userid} = req.params
        const {comment} = req.body
        const experience = await Experience.findById(id)
        const user = await User.findById(userid)

        if(!experience){
            return res.send({
                success:false,
                message:"Experience With This Id Is Not Found"
            })
        }

        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        
        if(!comment){
            return res.send({
                success:false,
                message:"Comment Should Not Be Empty"
            })
        }
        
        await Experience.findByIdAndUpdate(id , {
            comments:[...experience.comments , {comment:comment,user:userid}]
        } , {new:true})

        res.status(200).send({
            success:true,
            message:"Comment Added Successfully"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Commenting On Experience"
        })
    }
}


module.exports.getExperienceComments = async (req , res) => {
    try {
        const {id} = req.params
        const experience = await Experience.findById(id)
        if(!experience){
            return res.send({
                success:false,
                message:"Experience With This Id Is Not Found"
            })
        }

        const comments = experience.comments

        res.status(200).send({
            success:true,
            comments
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Comments On Experience"
        })
    }
}

module.exports.likeExperience = async (req , res) => {
    try {
        const {id , userid} = req.params
        const experience = await Experience.findById(id)
        const user = await User.findById(userid)

        if(!experience){
            return res.send({
                success:false,
                message:"Experience With This Id Is Not Found"
            })
        }

        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        if(experience.likes.includes(userid)){
            return res.send({
                success:false,
                message:"You Already Liked This Experience"
            })
        }

        await Experience.findByIdAndUpdate(id , {
            likes:[...experience.likes , userid]
        } , {new:true})

        res.status(200).send({
            success:true,
            message:"You Liked This Post"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Liking Experience"
        })
    }
}

module.exports.unLikeExperience = async (req, res) => {
    try {
        const {id , userid} = req.params
        const experience = await Experience.findById(id)
        const user = await User.findById(userid)

        if(!experience){
            return res.send({
                success:false,
                message:"Experience With This Id Is Not Found"
            })
        }

        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        const checkLikeExist = await Experience.find({likes:{ $in: [userid] }})

        if(checkLikeExist){
            const filterLikes = experience.likes.filter(like => like.toString() !== userid.toString())
            await Experience.findByIdAndUpdate(id , {
                likes:filterLikes
            } , {new:true})
    
            res.status(200).send({
                success:true,
                message:"You UnLiked This Post"
            })
        }

       

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Liking Experience"
        })
    }
}

module.exports.getExperienceLikesCount = async (req , res) => {
    try {
        const {id} = req.params
        const count = await Experience.find({user:id}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            likesCount:count
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Count Experience Likes"
        })
    }
}

module.exports.getUserLikedExperiences = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)
        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        const experiences = await Experience.find({likes:{$in:[id]}}).select("-theme")

        res.status(200).send({
            success:true,
            experiences
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Liked Experiences"
        })
    }
}

module.exports.removeUserFromExperience = async (req , res) => {
    try {
        const {id , userid} = req.params
        const experienceObj = await Experience.findById(id)
        const filteredExp = experienceObj.likes.filter(like => like.toString() !== userid)
        await Experience.findByIdAndUpdate(id , {likes:filteredExp} , {new:true})

        res.status(200).send({
            success:true,
            message:"Experience Removed From Your Like List Successfully"
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Liked Experiences"
        })
    }
}

module.exports.userDeleteExperience = async (req , res) => {
    try {
        const {id} = req.params

        await Experience.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"You Deleted Your Experience Successfully"
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Deleting User Experiences"
        })
    }
}

module.exports.userEditExperience = async (req , res) => {
    try {
        const {id , userid} = req.params
        const {title , experience} = req.fields
        const {theme} = req.files
        const user = await User.findById(userid)
        
        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        if(!title || !theme || !experience){
            return res.send({
                success:false,
                message:"Please Fill All Required Fields"
            })
        }

        const checkDuplicateTitle = await Experience.findOne({title})

        if(checkDuplicateTitle){
            return res.send({
                success:false,
                message:"Duplicated Title Please Pick New Title"
            })
        }

        await Experience.findByIdAndUpdate(id , {
            title,
            experience,
            theme:{data:fs.readFileSync(theme.path) , contentType:theme.type}
        } , {new:true})

        res.status(200).send({
            success:true,
            message:"Experience Updated Successfully"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Editing User Experiences"
        })
    }
}

module.exports.getSingleExperience = async (req , res) => {
    try {
        const {id} = req.params
        const experience = await Experience.findById(id).select("-theme")
        if(!experience){
            return res.send({
                success:false,
                message:"Experience Not Found"
            })
        }

        res.status(200).send({
            success:true,
            experience
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Single Experience"
        })
    }
}