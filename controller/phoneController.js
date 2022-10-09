const mongoose=require("mongoose")
const usermodel=require("../models/usermodel")

const searchPhone=async(req,res)=>{

   try {
	 const phone=req.body;
	
	    const user=await usermodel.find({phone:{$in:phone}});
	
	    if(user.length===0){
	        return res.status(500).json({
	            msg:"No Such Users are using app"
	        });
	    }
	    return res.status(200).json({
	        user
	    })
} catch (error) {
	console.log("catched error");
	res.status(500).json({
        msg:error
    })
}
}


module.exports=searchPhone;