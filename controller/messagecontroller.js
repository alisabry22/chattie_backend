const { json } = require("express");
const ObjectId = require("mongoose/lib/types/objectid");
const chatmodel = require("../models/chatmodel");
const messagemodel=require("../models/messagemodel");

async function sendMessage(content,sender,chatId){

var message={
	sender:sender,
	message:content,
	chat:chatId,
};

var uploadmessage=await messagemodel.create(message);
uploadmessage=await messagemodel.findById(uploadmessage._id).populate("sender","username email phone countrycode");
await chatmodel.findByIdAndUpdate(chatId,{latestMessage:uploadmessage._id});
return uploadmessage;

}
const allMessages=async(req,res)=>{

    const chatId=req.params.chatId;


   try {
	 const messages=await messagemodel.find({chat:chatId}).populate("sender","username phone email countrycode ");
	
	    res.status(200).json({messages});
} catch (error) {
	return res.status(500).json({msg:error.message});
}

}

module.exports={sendMessage,allMessages};
