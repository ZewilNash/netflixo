const mongoose = require("mongoose")

module.exports.connectDb = () => {
    mongoose.connect(process.env.MONGO_DB_URL).then(() => {
        console.log("Connected Successfully To Database".bgGreen.white)
    }).catch(err => console.log("Something Went Wrong Connecting DB".bgRed.white , err.message))
}