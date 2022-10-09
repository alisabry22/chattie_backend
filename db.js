const mongoose=require("mongoose");


 connecttoDb=function() {
  
    try{

        mongoose.connect("mongodb+srv://chatapp:01021142545ali@cluster0.qbvtvxy.mongodb.net/chat_app?retryWrites=true&w=majority")
        console.log("connected to db");
        
    }catch(err)
    {
        console.log(err);
    }
}


module.exports=connecttoDb;

