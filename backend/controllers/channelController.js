import mongoose from "mongoose";
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);
    if (!admin)
      return res.status(404).json({ message: "Admin user not found" });

    const ValidMembers = await User.find({ _id: { $in: members } });
    if (ValidMembers.length !== members.length)
      return res.status(400).json({ message: "Invalid member(s)" });

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};
export const getUserChannel = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ members: userId }, { admin: userId }],
    }).sort({updatedAt:-1});


    return res.status(201).json({ channels });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};
