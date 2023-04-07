const router = require("express").Router()
const {isSignin} = require("../middleware/auth")
const {createReview , getAllReviews , getPopularMovies , filterMoviesBasedOnRate , getUserReviews , getTopRatedMovies , getReviewsCount} = require("../controllers/review")

router.post("/create/:id" , isSignin , createReview)
router.get("/user-reviews/:movieid" , getUserReviews)
router.get("/reviews-count" , getReviewsCount)
router.get("/top-movies" , getTopRatedMovies)
router.get("/popular-movies" , getPopularMovies)
router.get("/rate-filter" , filterMoviesBasedOnRate)
router.get("/get-reviews" , getAllReviews)

module.exports = router