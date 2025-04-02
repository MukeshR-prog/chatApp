import { compare } from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {renameSync,unlinkSync} from "fs";
const createToken = (email, userId) => {
  const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: "3d",
  });
  return token;
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please provide an email and password");
    }
    const user = await User.create({ email, password, rawPassword: password });
    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please provide an email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Email is not found");
    }
    console.log("Stored Hashed Password:", user.password);
    console.log("Entered Password:", password);
    const auth = await compare(password, user.password);
    console.log("Password Match:", auth);
    if (!auth) {
      return res.status(400).send("Password is incorrect");
    }

    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User not found");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).send("All the firlds are mandatery");
    }
    const userData = await User.findByIdAndUpdate(userId,{
      firstName,
      lastName,
      color,
      profileSetup: true,
    },{
      new: true,
      runValidators:true
    });

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {

    if(!req.file){
      return res.status(400).send("Please upload an image");
    }
    const timestamp = Date.now();
    const fileName = `uploads/profiles/${timestamp}-${req.file.originalname}`;
    try {
      // Rename the file
      renameSync(req.file.path, fileName);
    } catch (fileErr) {
      console.log("File rename error:", fileErr);
      return res.status(500).send("Error saving file");
    }
    const updatedUser = await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true});
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (err) {
    console.log("Error in addProfileImage:", err);
    return res.status(500).send("Internal Server Error");
  }
};
export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).send("User not found");
    }
    if(user.image){
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return res.status(200).send(
      "Profile image deleted"
    );
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};
export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})
    return res.status(200).send(
      "Successfully logged out"
    );
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};