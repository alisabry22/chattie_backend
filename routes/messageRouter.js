const express=require("express");
const { sendMessage, allMessages } = require("../controller/messagecontroller");
const messageRoute=express.Router();
const verifyjwt=require("../middlewares/jwtverify")

//messageRoute.post("/",verifyjwt,sendMessage);
messageRoute.get("/:chatId",verifyjwt,allMessages);

module.exports=messageRoute;