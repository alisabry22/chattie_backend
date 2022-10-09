const express=require("express")
const app=express()
const mongoose=require("./db")
const phoneroute=require("./controller/phoneController")
const authroute=require("./routes/authroutes")
const http=require("http");
const server=http.createServer(app)
const io=require("socket.io")(server)
const chatRoutes=require("./routes/chatroute")
const messageRoute = require("./routes/messageRouter")
const { sendMessage } = require("./controller/messagecontroller")
const storyroute = require("./routes/storyroutes")


app.use(express.urlencoded({extended:false}));
app.use(express.json());

mongoose();

app.use("/api/phone",phoneroute)
app.use("/api/user",authroute)
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoute);
app.use("/api/story",storyroute);

app.get("/",(req,res)=>{
    res.send("welcome user");
})

io.on("connection", (client)=>{

  client.on("JoinChat",(chatId)=>{
    client.join(chatId);
    chatId=chatId;
   
  })
  client.on("sendMessage",async (data)=>{

    message=await sendMessage(data.content,data.sender,data.chatId);
    
    io.to(data.chatId).emit("message",message);
})


 })



server.listen(3000,()=>{
    console.log("listenning to port",3000)

})






