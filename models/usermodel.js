const mongoose=require("mongoose")


const user= mongoose.Schema({

    username:{type:String},
    password:{type:String},
    email:{type:String},
    phone:{type:String},
    countrycode:{type:String},
    profilephoto:{type:String},
    chats:[{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}],
    quote:{type:String,default:"Hello There Iam Using chattie"},
    stories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Story"
        }
    ]
}
);

module.exports=mongoose.model("User",user);