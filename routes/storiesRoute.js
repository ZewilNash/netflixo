const router = require("express").Router()
const {createStory , removeUserFromStory , deleteStory , getStoryLikesCount , getUserLikedStories , likeAstory , getAllStories , getUserStories} = require("../controllers/story")
const {isSignin} = require("../middleware/auth")

router.post("/create/:id" , isSignin , createStory)
router.get("/stories" , getAllStories)
router.get("/user-stories/:id" , getUserStories)
router.put("/like/:id/:userid" , isSignin , likeAstory)
router.get("/user-liked-stories/:id" , getUserLikedStories)
router.get("/likeCount/:id" , getStoryLikesCount)
router.delete("/delete/:id" , isSignin , deleteStory)
router.put("/remove-from-like-list/:id/:userid" , isSignin ,removeUserFromStory)
module.exports = router