const express = require('express')
const http = require("http")
const cors = require('cors')
const dotenv = require('dotenv')
const {connectDb} = require("./config/db")
const colors = require("colors")
const authRoute = require("./routes/userRoutes")
const moviesRoute = require("./routes/moviesRoutes")
const castRoute = require("./routes/castRoute")
const reviewsRoute = require("./routes/reviewRoutes")
const experienceRoute = require("./routes/experienceRoute")
const messageRoute = require("./routes/message")
const storyRoute = require("./routes/storiesRoute")
const customerRoute = require("./routes/customerRoutes")
const {isAdmin , isSignin} = require("./middleware/auth")
const LogRocket = require("logrocket")

LogRocket.init('v3hv1w/netflixy');

dotenv.config()

connectDb()

const app = express()
// create express server
const server = http.Server(app)
// our socket server is an express server
const io =require("socket.io")(server , {
    cors: {
        origin:"*"
    }
})

app.use(express.json())
app.use(express.urlencoded({limit:"30mb" , extended:true}))
app.use(cors())

// routes here
app.use("/api/v1/auth" , authRoute)
app.use("/api/v1/movies" , moviesRoute)
app.use("/api/v1/casts" , castRoute)
app.use("/api/v1/reviews" , reviewsRoute)
app.use("/api/v1/experience" , experienceRoute)
app.use("/api/v1/message" , messageRoute)
app.use("/api/v1/stories" , storyRoute)
app.use("/api/v1/customer" , customerRoute)

const PORT = process.env.PORT || 9000

io.on("connection" , (socket) => {
    console.log("a user connected with id" , socket.id)

    socket.on("message" , (data) => {
       
        socket.emit("response" , data)
    })
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
})

server.listen(PORT, () => {
    console.log("Server Runing on port ".bgBlue.white, PORT)
})

