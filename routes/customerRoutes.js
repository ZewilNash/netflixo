const router = require("express").Router()
const {isSignin} = require("../middleware/auth")
const {sendMessage , getUsersMessages} = require("../controllers/message")

router.post("/send/:from/:to" , isSignin , sendMessage)
router.get("/get-messages/:from/:to" , getUsersMessages)

module.exports = router