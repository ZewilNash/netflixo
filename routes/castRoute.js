const router = require('express').Router()
const {createCast , getCastImage , getCastInfo , getMovieCasts}  = require("../controllers/cast")
const {isAdmin , isSignin} = require("../middleware/auth")
const formidable = require("express-formidable")

router.post("/create/:movieId" , isSignin , isAdmin , formidable() , createCast)
router.get("/get-cast-image/:id" , getCastImage)
router.get("/get-movie-casts/:id" , getMovieCasts)
router.get("/get-cast-info" , getCastInfo)

module.exports = router