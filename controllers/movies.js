const Movie = require("../model/Movie")
const fs = require("fs")

module.exports.createMovie = async (req , res) => {
    try {
        const {title , video , downloadUrl , language , duration , year , description , category} = req.fields
        const {image } = req.files

        switch (true) {
            case !title:
                return res.send({ message: "Title is Required", success: false })

            case !language:
                return res.send({ message: "Language is Required", success: false })

            case !duration:
                return res.send({ message: "Duration is Required", success: false })

            case !year:
                return res.send({ message: "Year is Required", success: false })

            case !description:
                return res.send({ message: "Description is Required", success: false })

            case !category:
                return res.send({ message: "Category is Required", success: false })


            case !video:
                return res.send({ message: "Video is Required", success: false })
            
            case !downloadUrl:
                return res.send({ message: "DownloadUrl is Required", success: false })
            
            case image && image.size > 1000000:
                return res.send({ message: "Image is Required and should be less than 1mb", success: false })
        }

       
        const movie = await Movie({
            title,
            language,
            duration,
            year,
            description,
            category,
            video,
            downloadUrl
        })

        if(image){
            movie.image.data = fs.readFileSync(image.path)
            movie.image.contentType = image.type
        }

        // if(video){
        //     movie.video.data = fs.readFileSync(video.path)
        //     movie.video.contentType = video.type
        // }

        await movie.save()

        res.status(200).send({
            message:"Successfully Created Movie",
            success:true,
            movie
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Login..",
            error
        })
    }
}
module.exports.UpdateMovie = async (req , res) => {
    try {
        const {title , video , downloadUrl , language , duration , year , description , category} = req.fields
        const {image } = req.files
        const {id} = req.params

        switch (true) {
            case !title:
                return res.send({ message: "Title is Required", success: false })

            case !language:
                return res.send({ message: "Language is Required", success: false })

            case !duration:
                return res.send({ message: "Duration is Required", success: false })

            case !year:
                return res.send({ message: "Year is Required", success: false })

            case !description:
                return res.send({ message: "Description is Required", success: false })

            case !category:
                return res.send({ message: "Category is Required", success: false })


            case !video:
                return res.send({ message: "Video is Required", success: false })
            
            case !downloadUrl:
                return res.send({ message: "DownloadUrl is Required", success: false })
            
            case image && image.size > 1000000:
                return res.send({ message: "Image is Required and should be less than 1mb", success: false })
        }

       
       const movie =  await Movie.findByIdAndUpdate(id,{
            title,
            language,
            duration,
            year,
            description,
            category,
            video,
            downloadUrl,
            image:{data:fs.readFileSync(image.path) , contentType:image.type}
        } , {new:true})

        // const movie = await Movie.findById(id)

        // if(image){
        //     movie.image.data = fs.readFileSync(image.path)
        //     movie.image.contentType = image.type
        // }

        // if(video){
        //     movie.video.data = fs.readFileSync(video.path)
        //     movie.video.contentType = video.type
        // }

        // await movie.save()

        res.status(200).send({
            message:"Successfully Updated Movie",
            success:true,
            movie
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Login..",
            error
        })
    }
}

module.exports.getMovies = async (req , res) => {
    try {
        const movies = await Movie.find({}).select("-image -casts").sort({createdAt:-1})
        res.status(200).send({
            success:true,
            movies
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Getting Movies..",
            error
        })
    }
}

module.exports.getMovieImage = async (req , res) => {
    try {
        const {id} = req.params
        const movie = await Movie.findById(id).select("image")
        if(movie.image.data){
            res.set("Content-Type", movie.image.contentType)
            return res.status(200).send(movie.image.data)
        }
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Movie Image"
        })
    }
}


module.exports.relatedMovies = async (req , res) => {
    try {
        const {id} = req.params
        const {category} = req.query

        const movies = await Movie.find({
            category:category,
            _id:{$ne:id}
        }).select("-image -casts").limit(4)

        res.status(200).send({
            success:true,
            movies
        })

    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error In Getting Related Movies"
        })
    }
}

module.exports.getMoviesCount = async (req , res) => {
    try {
        const count = await Movie.estimatedDocumentCount()
        res.status(200).json({moviesCount:count , success:true})
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting movies Count..",
            error
        })
    }
}

module.exports.getSingleMovie = async (req , res) => {
    try {
        const {id} = req.params
        const movie = await Movie.findById(id).select("-image -casts")
        if(!movie){
            return res.send({
                success:false,
                message:"Movie With This Id Not Found"
            })
        }

        res.status(200).send({
            success:true,
            movie
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While getting Single movie ..",
            error
        })
    }
}

module.exports.filterMovies = async (req , res) => {
    try {
        const {category , year , duration} = req.query

        if(category){
            movies = await Movie.find({category}).select("-image")
        }
        if(year){
            movies = await Movie.find({year}).select("-image")
        }
        if(duration){
            movies = await Movie.find({duration}).select("-image")
        }


        res.status(200).send({
            success:true,
            movies
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Sorting movies..",
            error
        })
    }
}

module.exports.searchMovie = async (req , res) => {
    try {
        const {searchValue} = req.query

        const movies = await Movie.find({title:{$regex:'^' + searchValue, $options:"i"}}).select("-image").exec()

        res.status(200).send({
            success:true,
            movies
        })

    }catch(error){
        res.status(500).send({
            success:false,
            message:"Something Went Wrong While Searching movies..",
            error
        })
    }
}

