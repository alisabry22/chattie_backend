const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/types/objectid");
const { countDocuments } = require("../models/chatmodel");
const chatmodel = require("../models/chatmodel");
const usermodel = require("../models/usermodel");


const createChat = async (req, res) => {



    var isChat = await chatmodel.find({
        isgroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: req.body.userId } } },
        ],
    }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await usermodel.populate(isChat, {
        path: "latestMessage.sender",
        select: "username email phone",
    });


    if (isChat.length > 0) {


        return res.status(200).json({ "chatId": isChat[0]._id });
    } else {
        try {

            var chatData = {
                isgroupChat: false,
                users: [req.user._id, req.body.userId],
                chatName: "sender",
            };

            const createChatroom = await chatmodel.create(chatData);
            const chat = await chatmodel.findById(createChatroom._id);
            await usermodel.findByIdAndUpdate(req.user._id, { $push: { chats: chat._id } });
            await usermodel.findByIdAndUpdate(req.body.userId, { $push: { chats: chat._id } });
            return res.status(200).json({ "chatId": chat._id });


        } catch (error) {
            return error.message;
        }
    }
}
const fetchAllChats = async (req, res) => {

    try {

        var userchat = await usermodel.findById(req.user._id).select("-password -countrycode -quote").populate("chats");

      
        console.log(userchat);

       
     
        console.log("chat  ",userchat);
        return res.status(200).json({
            userchat
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }

}

const createGroupChat = async (req, res) => {

    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ msg: "Please Fill in All Parts" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ msg: "you Must choose more than 2 users" });

    }
    users.push(req.user);

    try {
        var createchat = await chatmodel.create({
            chatName: req.body.name,
            users: users,
            groupAdmin: req.user,

        });
        var fullgroupchat = await chatmodel.findOne({ _id: createchat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json({
            fullgroupchat
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }

}

const editGroupChat = async (req, res) => {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
        return res.status(400).json({
            msg: "Please provide new name for chat..."
        });


    }
    var updatedchat = await chatmodel.findByIdAndUpdate(chatId, {
        chatName
    },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedchat) {
        return res.status(404).json({
            msg: "Chat not Found",
        });
    }
    return res.status(200).json({ updatedchat });
}

//add more users to group 
const addUserToGroup = async (req, res) => {
    if (!req.body.chatId || !req.body.users) {
        return res.status(404).json({
            msg: "please select one user or more ",
        });
    }

    var testgroup = await chatmodel.find({ _id: req.body.chatId, users: { $in: req.body.users } }, "_id");
    console.log(testgroup);
    if (testgroup.length >= 1) {
        return res.status(400).json({
            msg: "you can't add people already in this chat group"
        })
    }

    var pushed = await chatmodel.findByIdAndUpdate(req.body.chatId, {

        $push: {
            users: req.body.users,
        }
    },

        {
            new: true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!pushed) {
        return res.status(404).json({
            msg: "failed to add users to group"
        });
    }

    return res.status(200).json({ pushed });

}

const removeUserFromGroup = async (req, res) => {


    const removeuser = await chatmodel.findByIdAndUpdate(req.body.chatId, {
        $pull: {
            users: ObjectId(req.body.userid)
        }
    },
        {
            new: true
        });
    console.log(removeuser);

    if (!removeuser) {
        return res.status(404).json({
            msg: "can't delete user from group"
        });

    }
    return res.status(200).json({
        msg: "user deleted succssefully"
    });

}
module.exports = { createChat, fetchAllChats, createGroupChat, editGroupChat, addUserToGroup, removeUserFromGroup };