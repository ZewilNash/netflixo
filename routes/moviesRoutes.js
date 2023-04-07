const router = require("express").Router()
const {isAdmin , isSignin} = require("../middleware/auth")
const {createMovie  , UpdateMovie , searchMovie , getMovies , getSingleMovie , filterMovies , getMovieImage , relatedMovies , getMoviesCount} = require("../controllers/movies")
const formidable = require('express-formidable')

router.post("/create", isSignin , isAdmin , formidable() , createMovie)
router.put("/update/:id", isSignin , isAdmin , formidable() , UpdateMovie)
router.get("/get-movies", getMovies)
router.get("/get-movie-image/:id", getMovieImage)
router.get("/related-movie/:id", relatedMovies)
router.get("/movies-count", getMoviesCount)
router.get("/single-movie/:id", getSingleMovie)
router.get("/filter-movie", filterMovies)
router.get("/search-movie", searchMovie)


module.exports = router