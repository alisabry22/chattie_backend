const jwt=require("jsonwebtoken");
const usermodel = require("../models/usermodel");
require("dotenv").config();
verifyjwt=async(req,res,next)=>{

    const authheader=req.headers.authorization;
   if(!authheader){
    return res.status(403).json({msg:" A token is required for authentication"})
   }
    const token = authheader.toString().split(" ")[1];
   
    if(!token)return res.status(403).json({msg:" A token is required for authentication"});
    try{
        const {uid}=jwt.verify(token,process.env.JWT_KEY);
        
        req.user=await usermodel.findById(uid).select("-password");
        
        next();

    }catch(e){
        console.log(e);
        return res.status(500).json({msg:e.message});
    }
   
}
module.exports=verifyjwt;