const mongoose=require("mongoose");



const MessageSchema=new mongoose.Schema({


    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},


    message:{
        type:String
    },
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}
},
{timestamps:true}
);
module.exports=mongoose.model("Message",MessageSchema);