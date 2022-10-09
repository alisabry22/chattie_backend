const express=require("express");
const {  fetchAllChats, createGroupChat, editGroupChat, addUserToGroup, removeUserFromGroup, createChat } = require("../controller/chatcontroller");
const router=express.Router();
const verifyjwt=require("../middlewares/jwtverify")

router.get("/",verifyjwt,fetchAllChats);
router.post("/",verifyjwt,createChat);
router.post("/createGroup",verifyjwt,createGroupChat),
router.put("/editGroup",verifyjwt,editGroupChat);
router.put("/addUsertoGroup",verifyjwt,addUserToGroup);
router.put("/removeUserFromGroup",verifyjwt,removeUserFromGroup);

module.exports=router;