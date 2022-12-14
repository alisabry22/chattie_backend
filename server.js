const express = require("express")
const app = express()
const mongoose = require("./db")
const phoneroute = require("./controller/phoneController")
const authroute = require("./routes/authroutes")
const http = require("http");
const server = http.createServer(app)
const io = require("socket.io")(server)
const chatRoutes = require("./routes/chatroute")
const messageRoute = require("./routes/messageRouter")
const { sendMessage } = require("./controller/messagecontroller")
const storyroute = require("./routes/storyroutes")
const chatmodel = require("./models/chatmodel")
const messagemodel = require("./models/messagemodel")
const usermodel = require("./models/usermodel")
const storyModel = require("./models/storyModel")


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose();


//listen for message change




app.use("/api/phone", phoneroute)
app.use("/api/user", authroute)
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoute);
app.use("/api/story", storyroute);

app.get("/", (req, res) => {
  res.send("welcome user");
})

io.on("connection", (client) => {

  client.on("JoinChat", (chatId) => {
    client.join(chatId);
    chatId = chatId;

  })
  client.on("sendMessage", async (data) => {

    message = await sendMessage(data.content, data.sender, data.chatId);
    console.log(message);
    io.to(data.chatId).emit("message", message);
  })


}); 
chatChangeStream = chatmodel.watch();

chatChangeStream.on("change", async data => {
console.log(data);

switch(data.operationType){
  case 'update':
    var message = await messagemodel.findById(data.updateDescription.updatedFields.latestMessage);
    io.emit("latestmessage",message);
    break;
    case 'delete':
     io.emit("deletedchat",data.documentKey._id);
     break;
     case 'insert':
      var chat=await chatmodel.findById(data.fullDocument._id).populate("users","username email phone countrycode");
      console.log(chat);
      io.emit("createdchat",chat);
      break;

}
   
  

  


});

//on adding story send event 
storyChangeStream=storyModel.watch();

storyChangeStream.on("change",async data=>{

  switch(data.operationType){
    case 'insert':
      var story=await storyModel.findById(data.fullDocument._id).populate("userId","username email phone countrycode");
      console.log(story);
      io.emit("insertedStory",story);
      break;
      case 'delete':
        console.log("deleted story",data.documentKey._id);
        io.emit("deletedStory",data.documentKey._id);
        break;
  }

});





server.listen(3000, () => {
  console.log("listenning to port", 3000)

})






