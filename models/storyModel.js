const mongoose=require("mongoose")

const storyModel=mongoose.Schema({

userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
storyLink:{type:String},
},{
    timestamps:true
});

module.exports=mongoose.model("Story",storyModel);