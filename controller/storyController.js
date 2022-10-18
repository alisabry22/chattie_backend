const storyModel = require("../models/storyModel");
const usermodel = require("../models/usermodel");

const uploadStory = async (req, res) => {

    if (!req.body.storyurl) {
        return res.status(200).json({ msg: "please provide story" });

    }

    try {
        const storymodel = { userId: req.user._id, storyLink: req.body.storyurl };
        const story = await storyModel.create(storymodel);
        await usermodel.findByIdAndUpdate(req.user._id, { $push: { stories: story._id } });
        return res.status(200).json(story);
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const getCurrentuserStories = async (req, res) => {

    try {
        const stories = await usermodel.findById(req.user._id).select("username email phone countrycode").populate("stories").sort({ updatedAt: -1 });
        if (!stories) {
            return res.status(400).json({ msg: "their is not stories till now" });
        }
        return res.status(200).json({ stories });
    } catch (error) {
        return res.status(500).json({ msg: "please try again later" });
    }

}

const getOthersStory = async (req, res) => {

    var phones = req.body;
    if (!phones) {
        return res.status(400).json({ msg: "please provide others phones" });
    }

    var stories = await usermodel.find({
        $and: [
            { phone: { $in: phones } },
            { phone: { $ne: req.user.phone } }
        ]
    })
        .select("stories username phone email countrycode").populate("stories");


    if (!stories) {
        return res.status(400).json({ msg: "please add some people" });;
    }
    return res.status(200).json({ stories });


}

const deleteStory = async (req, res) => {

    const storyId = req.body.storyId;

    await storyModel.findByIdAndRemove(storyId);
    var deletedstory=await usermodel.updateOne({_id:req.user._id}, {$pull:{stories:{storyId}}});
    if(!deletedstory){
        return res.status(400).json({msg:"their is no story "});
    }
    return res.status(200).json({msg:"Deleted Successfullu"});

}

module.exports = { uploadStory, getCurrentuserStories, getOthersStory, deleteStory };