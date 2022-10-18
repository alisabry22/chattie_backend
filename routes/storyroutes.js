const express=require("express");
const { uploadStory, getCurrentuserStories, getOthersStory, deleteStory } = require("../controller/storyController");
const storyroute=express.Router();
const verifyJwt=require("../middlewares/jwtverify")


//post story to mongoose 

storyroute.post("/uploadstory",verifyJwt,uploadStory)

//get all stories  for current user

storyroute.get("/getcurrentstory",verifyJwt,getCurrentuserStories);

//get others story 

storyroute.post("/getotherstory",verifyJwt,getOthersStory);

//delete story 

storyroute.post("/deletestory",verifyJwt,deleteStory);

module.exports=storyroute;  