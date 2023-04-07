const router = require("express").Router()
const {createMail} = require("../controllers/email")

router.post("/create" , createMail)

module.exports = router