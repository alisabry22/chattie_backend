const express=require("express")
const router=express.Router()
const {create_user,validate_user,renewtoken,getUserInfo}=require("../controller/usercontroller")
const jwtverify=require("../middlewares/jwtverify")

router.get("/",(req,res)=>{
    res.send("Welcome dear");
})
    
router.post("/adduser",create_user)
router.post("/login",validate_user)
router.get("/renewtoken",jwtverify,renewtoken)
router.post("/getuser",jwtverify,getUserInfo)




module.exports=router