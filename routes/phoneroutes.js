const express=require("express")
const router=express.Router();
const searchPhone=require("../controller/phoneController")
const verifyjwt=require("../middlewares/jwtverify")

router.post("/searchphone",verifyjwt,searchPhone)
module.exports=router;