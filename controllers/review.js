const Review = require("../model/Review")
const Movie = require("../model/Movie")
const User = require("../model/UserModel")
const _ = require('lodash');

module.exports.createReview = async (req , res) => {
    try {
        const {id} = req.params
        const {review , rate} = req.body

        if(!review || !rate){
            return res.send({
                success:false,
                message:"Please Provide All Required Fields"
            })
        }

        const movie = await Movie.findById(id)

        if(!movie){
            return res.send({
                success:false,
                message:"You Try To Review On A Movie That Doesn't Exist"
            })
        }

        const userId = req.user._id

        const reviewObj = await Review({
            review,
            rate,
            user:userId,
            movie:id
        }).save()

        res.status(200).send({
            success:true,
            reviewObj
        })

    }catch(error){
         res.status(500).send({
            success:false,
            message:"Something Went Wrong While Creating Review..",
            error
        })
    }
}

module.exports.getUserReviews = async (req , res) => {
    try {
        const {movieid} = req.params
        const movie = await Movie.findById(movieid)
        if(!movie){
            return res.send({
                success:false,
                message:"You Try To Fetch Reviews Of User / Movie That Doesn't Exist"
            })
        }

        const reviews = await Review.find({movie:movieid})

        res.status(200).send({
            success:true,
            reviews
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Getting User Review..",
            error
        })
    }
}

module.exports.getReviewsCount = async (req , res) => {
    try {
        const count = await Review.estimatedDocumentCount()
        res.status(200).json({reviewsCount:count , success:true})
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting reviews Count..",
            error
        })
    }
}

module.exports.getTopRatedMovies = async (req , res) => {
    try {
        const topRatedMovies = await Review.find({rate:"5-MasterPiece"}).populate("movie").select("movie")

        const topRatedMoviesArray = topRatedMovies.map(movie => {
            return {
                _id:movie.movie._id,
                title:movie.movie.title,
                language:movie.movie.language,
                duration:movie.movie.duration,
                year:movie.movie.year,
                description:movie.movie.description,
                category:movie.movie.category,
                video:movie.movie.video,
                casts:movie.movie.casts
            }
        })

        res.status(200).send({
            success:true,
            topRatedMoviesArray
        })

    }catch (error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting Top Rated Movies..",
            error
        })
    }
}

module.exports.getPopularMovies = async (req , res) => {
    try {
        const rate = "2-Good"
        // const rate = "5-MasterPiece" || "3-Very Good" || "4-Excellent"
       
        const allReviews = await Review.find({ rate: {$ne: rate}}).populate("movie").select("movie")

        const popularMoviesArray = allReviews.map(movie => {
            return {
                _id:movie.movie._id,
                title:movie.movie.title,
                language:movie.movie.language,
                duration:movie.movie.duration,
                year:movie.movie.year,
                description:movie.movie.description,
                category:movie.movie.category,
                video:movie.movie.video,
                casts:movie.movie.casts
            }
        })

       
        res.status(200).send({
            success:true,
            popularMoviesArray:_.uniqBy(popularMoviesArray, obj => obj.title)
        })

    }catch (error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting Top Popular Movies..",
            error
        })
    }
}

module.exports.filterMoviesBasedOnRate = async (req , res) => {
    try {
        const {rate} = req.query
        const allReviews = await Review.find({ rate }).populate("movie").select("movie")
        const moviesBaseOnRate = allReviews.map(movie => {
            return {
                _id:movie.movie._id,
                title:movie.movie.title,
                language:movie.movie.language,
                duration:movie.movie.duration,
                year:movie.movie.year,
                description:movie.movie.description,
                category:movie.movie.category,
                video:movie.movie.video,
                casts:movie.movie.casts
            }
        })

        res.status(200).send({
            success:true,
            moviesBaseOnRate:_.uniqBy(moviesBaseOnRate, obj => obj.title)
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Sorting Movies..",
            error
        })
    }
}

module.exports.getAllReviews = async (req , res) => {
    try {
        const reviews = await Review.find({})
        res.status(200).send({
            success:true,
            reviews
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Fetching Reviews..",
            error
        })
    }
}