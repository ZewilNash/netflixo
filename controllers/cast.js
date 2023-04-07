const Cast = require("../model/Cast")
const Movie = require("../model/Movie")
const fs = require("fs")

module.exports.createCast = async (req , res) => {
    try {
        const {movieId} = req.params
        const {castName} = req.fields
        const {castImage} = req.files

        console.log(castName)

        console.log(movieId , castName)

        if(!castName || !castImage){
            return res.send({
                success:false,
                message:"Cast Image & Cast Name & movieId are required"
            })
        }

        const movie = await Movie.findById(movieId)

        if(!movie){
            return res.send({
                success:false,
                message:"Movie With This Id Not Found"
            })
        }

        const cast = await Cast({
            castName,
            movie:movieId
        })

        cast.castImage.data = fs.readFileSync(castImage.path)
        cast.castImage.contentType = castImage.type

        await cast.save()

        await Movie.findByIdAndUpdate(movieId , {casts:[...movie.casts , cast]} , {new:true})

        res.status(200).send({
            message:"Cast Added To Movie Successfully",
            success:true,
            cast
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Creating Casts..",
            error
        })
    }
}

module.exports.getCastImage = async (req , res) => {
    try {
        const {id} = req.params
        const cast = await Cast.findById(id).select("castImage")
        if(cast.castImage.data){
            res.set("Content-Type", cast.castImage.contentType)
            return res.status(200).send(cast.castImage.data)
        }
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Cast Image"
        })
    }
}

module.exports.getMovieCasts = async (req , res) => {
    try {   
        const {id} = req.params
        const movie = await Movie.findById(id)
        if(!movie){
            return res.send({
                success:false,
                message:"Movie With This Id Not Found"
            })
        }
        const casts = await Cast.find({movie:id}).select("-castImage")

        res.status(200).send({
            success:true,
            casts
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Movie Casts"
        })
    }
}

module.exports.getCastInfo = async (req , res) => {
    try {
        const {castName} = req.query
        const cast = await Cast.findOne({castName}).select("-castImage")
        const allRelatedToCast = await Cast.find({castName:castName}).select("-castImage").populate("movie")

        const movies = allRelatedToCast.map(data => {
            return {
               
                    _id:data.movie._id,
                    title:data.movie.title,
                    description:data.movie.description,
                    category:data.movie.category,
                    year:data.movie.year,
                    duration:data.movie.duration,
                    language:data.movie.language,
                    video:data.movie.video
                }
            
        })

        res.status(200).send({
            success:true,
            movies:movies,
            cast:cast
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Casts Info"
        })
    }
}