const router = require("express").Router()
const {isAdmin , isSignin} = require("../middleware/auth")
const formidable = require('express-formidable')
const {login , addMovieToUserFavourites , deleteFromFavourite , getFavouriteMovies , getUserCoverImage , updateUserConverImage , userSendMessageViaEmail , customerSendMessageViaEmail , changeAdminProfilePassword , changeUserProfilePassword , signup , getUserFavouriteMovies , addMovieToFavourites , deleteUser , getUsersCount, getSingleUser , updateUserProfile , getAllUsers , getUserImage , updateProfile} = require("../controllers/user")

router.get("/user-auth" , isSignin , (req , res) => {
    res.status(200).send({ok:true})
})

router.get("/admin-auth" , isSignin , isAdmin , (req , res) => {
    res.status(200).send({ok:true})
})

router.post("/login" , login)
router.post("/signup" , signup)
router.post("/userSendMessageViaEmail" , isSignin , userSendMessageViaEmail)
router.post("/customerSendMessageViaEmail", customerSendMessageViaEmail)
router.get("/count" , getUsersCount)
router.get("/users" , getAllUsers)
router.put("/user/:id" , isSignin , formidable() , updateProfile)
router.put("/update-user-cover/:id" , isSignin , formidable() , updateUserConverImage)
router.put("/admin/user/:id" , isSignin , isAdmin , formidable() , updateUserProfile)
router.get("/user-image/:id" , getUserImage)
router.get("/user-cover-image/:id" , getUserCoverImage)
router.get("/single-user/:id" , getSingleUser)
router.delete("/user/:id" , isSignin , isAdmin , deleteUser)
router.put("/add-to-favourite/:id" , isSignin, addMovieToFavourites)
router.get("/get-favourite" , isSignin , getUserFavouriteMovies)
router.get("/get-favourite-movies/:id" , isSignin , getFavouriteMovies)
router.put("/admin-update-pass/:id" , isSignin , isAdmin , changeAdminProfilePassword)
router.put("/user-update-pass/:id" , isSignin , changeUserProfilePassword)
// router.get("/user-favs/:id" , isSignin , getUserFavouriteMovies)
router.put("/delete-from-favourite/:id" ,isSignin, deleteFromFavourite)

module.exports = router