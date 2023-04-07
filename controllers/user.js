const User = require("../model/UserModel")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const fs = require('fs')
const Movie = require("../model/Movie")
const Mail = require("../model/Emails")
// const wpm = require("wpm")

module.exports.login = async (req , res) => {
    try {
        const {email , password} = req.body
       
        if(!email || !password){
            return res.send({
                 success:false,
                 message:"Please Provide email or password"
             })
         }

         const user = await User.findOne({email})
         
        if(!user){
            return res.send({
                success:false,
                message:"User With This Email Not Found You May Create New Account Or Try Again"
            })
        }

        const checkPasswordMatch = await bcrypt.compare(password , user.password)

        if(!checkPasswordMatch){
            return res.send({
                success:false,
                message:"You Provide Invalid Credentials You May Create New Account Or Try Another Credentials"
            })
        }

        const token = await JWT.sign({_id:user._id} , process.env.WEB_TOKEN_SECRET , {expiresIn:"7h"})

        res.status(200).send({
            success:true,
            message:"You Logged In Successfully",
            user:{
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                role:user.role,
                image:user.image,
                favourites:user.favourites
            },
            token
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Login..",
            error
        })
    }
}

module.exports.signup = async (req , res) => {
    try {
        const {fullname , email , password , role , favourites , image} = req.body
        const checkDuplicatedEmail = await User.findOne({email})

        if(!fullname){
            return res.send({
                success:false,
                message:"Please Provide Your Fullname"
            })
        }
        if(!email){
            return res.send({
                success:false,
                message:"Please Provide Your Email"
            })
        }
        if(!password){
            return res.send({
                success:false,
                message:"Please Provide Your Password"
            })
        }

        if(password.length < 8){
            return res.send({
                success:false,
                message:"Please Provide A Valid Password (length more than 8)"
            })
        }

        if(checkDuplicatedEmail){
            return res.send({
                success:false,
                message:"This Email is In Use Please Provide Another Email"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)
       

        const user = await User({
            fullname,
            email,
            password:hashedPassword,
        }).save()

        const token = await JWT.sign({_id:user._id} , process.env.WEB_TOKEN_SECRET , {expiresIn:"7h"})

        res.status(201).send({
            success:true,
            message:"User Created Successfully",
            user,
            token
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Login..",
            error
        })
    }
}

module.exports.getUsersCount = async (req , res) => {
    try {
        const count = await User.estimatedDocumentCount()
        res.status(200).json({usersCount:count , success:true})
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting users Count..",
            error
        })
    }
}

module.exports.getAllUsers = async (req , res) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            success:true,
            users
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting users Count..",
            error
        })
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        // req.fields comes from express formidable middleware 
        const { fullname, email} = req.fields
        const { image } = req.files

        switch (true) {
            case !fullname:
                return res.send({ message: "Name is Required", success: false })

            case !email:
                return res.send({ message: "Email is Required", success: false })
           
            case image && image.size > 1000000:
                return res.send({ message: "Image is Required and should be less than 1mb", success: false })
        }

        let user = await User.findByIdAndUpdate(req.params.id, {
            ...req.fields , image:{data:fs.readFileSync(image.path) , contentType:image.type}
        }, { new: true })
        
       
        // if (image) {
        //     user.image.data = fs.readFileSync(image.path)
        //     user.image.contentType = image.type
        // }

        await user.save()

        res.status(201).send({
            success: true,
            message: "User Updated Successfully",
            user,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error In Updating User"
        })
    }
}
module.exports.updateUserProfile = async (req, res) => {
    try {
        // req.fields comes from express formidable middleware 
        const { fullname, email} = req.fields
        const { image } = req.files

        switch (true) {
            case !fullname:
                return res.send({ message: "Name is Required", success: false })

            case !email:
                return res.send({ message: "Email is Required", success: false })
           
            case image && image.size > 1000000:
                return res.send({ message: "Image is Required and should be less than 1mb", success: false })
        }

        let user = await User.findByIdAndUpdate(req.params.id, {
            ...req.fields , image:{data:fs.readFileSync(image.path) , contentType:image.type}
        }, { new: true })
        
       
        // if (image) {
        //     user.image.data = fs.readFileSync(image.path)
        //     user.image.contentType = image.type
        // }

        await user.save()

        res.status(201).send({
            success: true,
            message: "User Updated Successfully",
            user,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error In Updating User"
        })
    }
}

module.exports.getUserImage = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select("image")
        if(user.image.data){
            res.set("Content-Type", user.image.contentType)
            return res.status(200).send(user.image.data)
        }
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Image"
        })
    }
}
module.exports.getUserCoverImage = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select("coverImage")
        if(user.coverImage.data){
            res.set("Content-Type", user.coverImage.contentType)
            return res.status(200).send(user.coverImage.data)
        }
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Cover Image"
        })
    }
}

module.exports.getSingleUser = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select("-image")

        if(!user){
          return res.send({
                success:false,
                message:"User With This Id Not Found",
                user
            })
        }

        res.status(200).send({
            success:true,
            user
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Image"
        })
    }
}

module.exports.updateUserConverImage = async (req , res) => {
    try {
        const { coverImage } = req.files
        const {id} = req.params

        const user = await User.findById(id)
        if(!user){
            return res.send({
                success:false,
                message:"User With This Id Not Found",
                user
            })
        }

        if(!coverImage){
            return res.send({
                success:false,
                message:"Please Provide Cover Image",
                user
            })
        }

        // if(coverImage && coverImage.size > 1000000){
        //     return res.send({
        //         success:false,
        //         message:"Image is Required and should be less than 1mb",
        //         user
        //     })
        // }

        
        const updatedUser = await User.findByIdAndUpdate(id , {coverImage:{
            data:fs.readFileSync(coverImage.path) , contentType:coverImage.type
        }} , {new:true})

        res.status(200).send({
            success:true,
            message:"User Cover Image Updated Successfully",
            updatedUser
        })


    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Updating User Cover Image"
        })
    }
}

module.exports.deleteUser = async (req , res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)

        if(!user){
            res.send({
                message:"User With This Id Not Found",
                success:false
            })
        }

        await User.findByIdAndDelete(id)

        res.status(200).send({
            message:"User Deleted Successfull",
            success:true
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Image"
        })
    }
}

module.exports.addMovieToFavourites = async (req , res) => {
    try {
        const {id} = req.params
        const user  = await User.findById(req.user._id)

        const checkFavouriteExist = user.favourites.find(item => item.toString() === id)

        if(checkFavouriteExist){
           return res.send({
                success:false,
                message:"This Movie Is Already In Favourites Check It"
            })
        }

        await User.findByIdAndUpdate(req.user._id , {
            favourites:[...user.favourites ,id]
        } , {new:true})

        res.status(200).send({
            success:true,
            message:"Movie Added To Favourite Successfully"
        })
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Adding To Favourites"
        })
    }
}

module.exports.deleteFromFavourite = async (req , res) => {
    try {
  
        const {id} = req.params
        const favouritesArray  = await User.findById(req.user._id)
    
        const filteredFavourites = favouritesArray.favourites.filter(i => i.toString() !== id.toString())
     
        await User.findByIdAndUpdate(req.user._id , {favourites:filteredFavourites})
        
        res.status(200).send({
            success:true,
            message:"Movie Deleted From Favourites Successfully",
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Searching movies..",
            error
        })
    }
}

module.exports.getFavouriteMovies = async (req , res) => {
    try {
        const favouritesArray  = await User.find({_id:req.params.id}).select("favourites")

        const favourites = favouritesArray.map(item => {
           return {
               favourites:item.favourites
           }
       })

   
       const arrayOfFavIds = favourites[0].favourites

       const userFavouriteMovies = await Movie.find({
           '_id':{$in:arrayOfFavIds}
       }).select("-image")

       res.status(200).json({
           success:true,
           userFavouriteMovies
       })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Favourite Movies"
        })
    }
}

module.exports.getUserFavouriteMovies = async (req , res) => {
    try {
        const favouritesArray  = await User.find({_id:req.user._id}).select("favourites")

        const favourites = favouritesArray.map(item => {
           return {
               favourites:item.favourites
           }
       })

   
       const arrayOfFavIds = favourites[0].favourites

       const userFavouriteMovies = await Movie.find({
           '_id':{$in:arrayOfFavIds}
       }).select("-image")

       res.status(200).json({
           success:true,
           userFavouriteMovies
       })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting User Favourite Movies"
        })
    }
}

module.exports.changeAdminProfilePassword = async (req , res) => {
    try {
        const {id} = req.params
        const {oldPassword , newPassword , confirmPassword} = req.body
        const user = await User.findById(id)

        if(!oldPassword || !newPassword || !confirmPassword){
            return res.send({
                success:false,
                message:"Please Provide All Required Fileds"
            })
        }

        if(newPassword.length < 8){
            return res.send({
                success:false,
                message:"Please Provide Valid newPassword At Least 8 characters"
            })
        }

        if(newPassword !== confirmPassword){
            return res.send({
                success:false,
                message:"NewPassword & ConfirmPassword Must Match"
            })
        }

        
        const checkPasswordMatch = await bcrypt.compare(oldPassword , user.password)

        if(!checkPasswordMatch){
            return res.send({
                success:false,
                message:"Please Provide Your Valid Old Password To Continue"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10)

        await User.findByIdAndUpdate(id , {password:hashedPassword} , {new:true})

        res.status(200).send({
            success:true,
            message:"Your Password Updated Successfully You Can Login With Your New Password"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Changing Admin Profile Password"
        })
    }
}

module.exports.changeUserProfilePassword = async (req , res) => {
    try {
        const {id} = req.params
        const {oldPassword , newPassword , confirmPassword} = req.body
        const user = await User.findById(id)

        console.log(user.password)

        if(!oldPassword || !newPassword || !confirmPassword){
            return res.send({
                success:false,
                message:"Please Provide All Required Fileds"
            })
        }

        if(newPassword.length < 8){
            return res.send({
                success:false,
                message:"Please Provide Valid newPassword At Least 8 characters"
            })
        }

        if(newPassword !== confirmPassword){
            return res.send({
                success:false,
                message:"NewPassword & ConfirmPassword Must Match"
            })
        }

        
        const checkPasswordMatch = await bcrypt.compare(oldPassword , user.password)

        if(!checkPasswordMatch){
            return res.send({
                success:false,
                message:"Please Provide Your Valid Old Password To Continue"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10)

        await User.findByIdAndUpdate(id , {password:hashedPassword} , {new:true})

        res.status(200).send({
            success:true,
            message:"Your Password Updated Successfully You Can Login With Your New Password"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Changing User Profile Password"
        })
    }
}

module.exports.userSendMessageViaEmail = async (req , res) => {
    try {
        const {message} = req.body
        const email = req.user.email
        const checkDuplicateMsg = await Mail.findOne({message})

        if(!message){
            return res.send({
                success:false,
                message:"Please Provide All Required Fields"
            })
        }

        if(checkDuplicateMsg){
            return res.send({
                success:false,
                message:"You've Got Your Message Already Please Try Another Message"
            })
        }

        await Mail({email , message}).save()

        res.status(200).send({
            success:true,
            message:"Your Message Has Been Sent To Us Thanks For Your Message :)"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Sending WhatsApp Message"
        })
    }
}

module.exports.customerSendMessageViaEmail = async (req , res) => {
    try {
        const {email , message} = req.body
        const user = await User.findOne({email})
        const checkDuplicateMsg = await Mail.findOne({message})
       
        if(!email || !message){
            return res.send({
                success:false,
                message:"Please Provide All Required Fields"
            })
        }

        if(checkDuplicateMsg){
            return res.send({
                success:false,
                message:"You've Got Your Message Already Please Try Another Message"
            })
        }

       

        if(user){
            return res.send({
                success:false,
                message:"We Found Your Email Please Sign In / Register To Continue As A User Or Use Diffrent Email To Continue As A Guest"
            })
        }

        await Mail({email , message}).save()

        res.status(200).send({
            success:true,
            message:"Your Message Has Been Sent To Us Thanks For Your Message :)"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Sending WhatsApp Message"
        })
    }
}