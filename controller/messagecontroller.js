const chatmodel = require("../models/chatmodel");
const messagemodel=require("../models/messagemodel");

async function sendMessage(content,sender,chatId){

var message={
	sender:sender,
	message:content,
	chat:chatId,
};

var uploadmessage=await messagemodel.create(message);
uploadmessage=await messagemodel.findById(uploadmessage._id);
await chatmodel.findByIdAndUpdate(chatId,{latestMessage:uploadmessage._id});
return uploadmessage;

}
const allMessages=async(req,res)=>{

    const chatId=req.params.chatId;
	console.log("chat id ", chatId);

   try {
	 const messages=await messagemodel.find({chat:chatId});
		console.log(messages);
	    res.status(200).json({messages});
} catch (error) {
	return res.status(500).json({msg:error.message});
}

}

module.exports={sendMessage,allMessages};
