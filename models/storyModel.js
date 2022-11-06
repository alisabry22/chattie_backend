const mongoose=require("mongoose")

const storyModel=mongoose.Schema({

userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
storyLink:{type:String},
},{
    timestamps:true
});

storyModel.index({createdAt:1},{expireAfterSeconds:5});
module.exports=mongoose.model("Story",storyModel);