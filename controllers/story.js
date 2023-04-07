const User = require("../model/UserModel")
const Story = require("../model/Stories")
module.exports.createStory = async (req , res) => {
    try {
        const {id} = req.params
        const {story} = req.body
        const user = await User.findById(id)

        if(!user){
            return res.send({
                success:false,
                message:"User Not Found"
            })
        }

        if(!story){
            return res.send({
                success:false,
                message:"All Fields Are Required"
            })
        }

        const storyObj = await Story({
            story,
            user:id
        }).save()

        const userStories = [...user.stories , storyObj._id]

        await User.findByIdAndUpdate(id , {stories:userStories} , {new:true})

        res.status(200).send({
            success:true,
            message:"Story Created Successfully"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Creating Story"
        })
    }
}

module.exports.getAllStories = async (req , res) => {
    try {
        const stories = await Story.find({}).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            stories
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Stories"
        })
    }
}

module.exports.getUserStories = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)

        if(!user){
            return res.send({
                success:false,
                message:"User Not Found"
            })
        }

        const stories = await Story.find({'_id':{$in:user.stories}}).sort({createdAt:-1})

        res.status(200).send({
            success:true,
            stories
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Stories"
        })
    }
}

module.exports.likeAstory = async (req , res) => {
    try {
        const {id , userid} = req.params
        const story = await Story.findById(id)
        const storyUser = await User.findById(userid)

        if(!story || !storyUser){
            return res.send({
                success:false,
                message:"You Are Trying To Like Non Existing Story"
            })
        }

        if(story.likes.includes(userid)){
            return res.send({
                success:false,
                message:"You Already Liked This Story"
            })
        }

        const newStoryLikes = [...story.likes , userid]

        await Story.findByIdAndUpdate(id , {likes:newStoryLikes} , {new:true})

        res.status(200).send({
            success:true,
            message:"You Liked This Story"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Liking a story"
        })
    }
}

module.exports.getUserLikedStories = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)
        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Is Not Found"
            })
        }

        const stories = await Story.find({likes:{$in:[id]}})

        res.status(200).send({
            success:true,
            stories
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Liked Experiences"
        })
    }
}

module.exports.getStoryLikesCount = async (req , res) => {
    try {
        const {id} = req.params
        const count = await Story.find({user:id}).estimatedDocumentCount()
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

module.exports.deleteStory = async (req , res) => {
    try {
        const {id} = req.params
        await Story.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"You Deleted Your Story Successfully"
        })
    }catch(error){

    }
}

module.exports.removeUserFromStory = async (req , res) => {
    try {
        const {id , userid} = req.params
        const storyObj = await Story.findById(id)
        const filterStories = storyObj.likes.filter(like => like.toString() !== userid)
        await Story.findByIdAndUpdate(id , {likes:filterStories} , {new:true})

        res.status(200).send({
            success:true,
            message:"Story Removed From Your Like List Successfully"
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Liked Experiences"
        })
    }
}