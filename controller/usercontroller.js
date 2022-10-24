const usermodel = require("../models/usermodel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

create_user = async (req, res) => {

    console.log(req.body);
    try {
        const { username, password, email, phone,countrycode,profilephoto } = req.body;
     
        if (!username || !password || !email || !phone || !profilephoto) {

            return res.status(400).json({ msg: "please fill in all parts" })

        }

        const email1=email.toString();
        const phone1=phone.toString();
        

        var searchUser = await usermodel.find({$or:[{email:email1},{phone:phone1}]});
      
        if (searchUser.length>=1) {

            return res.status(401).json({ msg: "email or phone already exists" })
        }
        const hashedpassword = await bcrypt.hash(password, 10);

        user = new usermodel({ username: username, password: hashedpassword, email: email, phone: phone ,countrycode:countrycode,profilephoto:profilephoto})
        await user.save();

        const token = jwt.sign({ uid: user.id }, process.env.JWT_KEY, {
            expiresIn: "30d"
        })
        return res.status(200).json({
            user,
            token: token,
        })
    } catch (error) {

        return res.status(500).json({
            msg: error.message
        })
    }


}

validate_user = async (req, res) => {
   
    const { email, password } = req.body;
    
    try {
        if (!email || !password) return res.status(400).json({ msg: "please fill in all parts" })

        const user = await usermodel.findOne({ email }).select("username email phone countrycode password");
        if (!user) {

            return res.status(401).json({ msg: "email doesn't exist please sign up first" })
        }
        const validatepw = bcrypt.compare(password, user.password);
        if (!validatepw) return res.status(400).json({ msg: "password isn't right" })

        const token = jwt.sign({ uid: user.id },process.env.JWT_KEY, { expiresIn: "30d" })
        return res.status(200).json({ user, token: token });
    } catch (e) {
        return res.status(500).json({ msg: e.message })
    }

}

const renewtoken = async (req, res) => {
    try {
        const uid = req.user._id;
        const token = jwt.sign({ uid }, process.env.JWT_KEY, { expiresIn: "30d" });

        const user = await usermodel.findById(uid);
        if (!user)
            return res.status(400). json({
                msg: "user not found"
            })

        return res.status(200).json({
            user,
            token: token,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Failed to Login in please try again later..."
        })
    }
}

const getUserInfo=async(req,res)=>{
    try {
        const phone=req.body.phone;
      
        const user=await usermodel.findOne({phone});
  
        if(!user){
            return res.status(400).json({
                msg:"Can't find this user"
            })
        }
        return res.status(200).json({
            user    
        })
    } catch (error) {
        console.log(error.message);
    }
  
}

const editInfo=async(req,res)=>{

    const {profilephoto,quote}=req.body;
   try {
	 if(!profilephoto || !quote ){
	        return res.status(400).json({msg:"please fill all parts"});
	
	
	
	    }
	
	    var user=await usermodel.findByIdAndUpdate(req.user._id,{
	        profilephoto:profilephoto,
	        quote:quote,
	    });
	
	    if(user){
	        return res.json(200).json(user);
	    }
} catch (error) {
	return res.status(500).json({msg:error.toString()});
}

}
module.exports = { create_user, validate_user, renewtoken,getUserInfo,editInfo };