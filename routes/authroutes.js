const express=require("express")
const router=express.Router()
const {create_user,validate_user,renewtoken,getUserInfo, editProfileImage, editProfileQuote}=require("../controller/usercontroller")
const jwtverify=require("../middlewares/jwtverify")

router.get("/",(req,res)=>{
    res.send("Welcome dear");
})
//to sign up user 
router.post("/adduser",create_user)

//to login user
router.post("/login",validate_user)
// for updating token of user 
router.get("/renewtoken",jwtverify,renewtoken)
//get user info 
router.post("/getuser",jwtverify,getUserInfo)
//edit profile image 
router.post("/editprofilephoto",jwtverify,editProfileImage);

//for editing quote of user 
router.post("/editquote",jwtverify,editProfileQuote);



module.exports=router