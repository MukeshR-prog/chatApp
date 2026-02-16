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
export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId} = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
      path: "sender",
      select: "firstName lastName email _id image color",
      },
      });
      if (!channel) {
      return res.status(404).send("Channel not found.");
      }
      const messages = channel.messages;
      return res.status(201).json({ messages })
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const getChannelDetails = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId)
      .populate("members", "firstName lastName email _id image color")
      .populate("admin", "firstName lastName email _id image color");
    
    if (!channel) {
      return res.status(404).send("Channel not found.");
    }
    
    return res.status(200).json({ channel });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateChannelMembers = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { members } = req.body;
    const userId = req.userId;
    
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel not found.");
    }
    
    // Check if the user is admin
    const isAdmin = channel.admin.some(admin => admin.toString() === userId);
    if (!isAdmin) {
      return res.status(403).send("Only admins can update channel members.");
    }
    
    // Validate members
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid member(s)" });
    }
    
    channel.members = members;
    await channel.save();
    
    const updatedChannel = await Channel.findById(channelId)
      .populate("members", "firstName lastName email _id image color")
      .populate("admin", "firstName lastName email _id image color");
    
    return res.status(200).json({ channel: updatedChannel });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const addChannelMember = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { memberId } = req.body;
    const userId = req.userId;
    
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel not found.");
    }
    
    // Check if the user is admin
    const isAdmin = channel.admin.some(admin => admin.toString() === userId);
    if (!isAdmin) {
      return res.status(403).send("Only admins can add members.");
    }
    
    // Check if member exists
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).send("User not found.");
    }
    
    // Check if already a member
    if (channel.members.includes(memberId)) {
      return res.status(400).send("User is already a member.");
    }
    
    channel.members.push(memberId);
    await channel.save();
    
    const updatedChannel = await Channel.findById(channelId)
      .populate("members", "firstName lastName email _id image color")
      .populate("admin", "firstName lastName email _id image color");
    
    return res.status(200).json({ channel: updatedChannel });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const removeChannelMember = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { memberId } = req.body;
    const userId = req.userId;
    
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel not found.");
    }
    
    // Check if the user is admin
    const isAdmin = channel.admin.some(admin => admin.toString() === userId);
    if (!isAdmin) {
      return res.status(403).send("Only admins can remove members.");
    }
    
    // Cannot remove admin
    const isMemberAdmin = channel.admin.some(admin => admin.toString() === memberId);
    if (isMemberAdmin) {
      return res.status(400).send("Cannot remove admin from channel.");
    }
    
    channel.members = channel.members.filter(m => m.toString() !== memberId);
    await channel.save();
    
    const updatedChannel = await Channel.findById(channelId)
      .populate("members", "firstName lastName email _id image color")
      .populate("admin", "firstName lastName email _id image color");
    
    return res.status(200).json({ channel: updatedChannel });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};
