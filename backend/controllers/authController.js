import { compare } from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
    const user = await User.create({ email, password ,rawPassword:password });
    const token = createToken(email, user.id);
    res.cookie("jwt", token,{
        maxAge:3*24 * 60 * 60*1000,
        secure:true,
        sameSite :"None"
    });
    return res.status(201).json({ user:{
        id:user.id,
        email:user.email,
        profileSetup:user.profileSetup
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
      const auth = await  compare(password,user.password);
      if (!auth) {
        return res.status(400).send("Password is incorrect");
      }
      const token = createToken(email, user.id);
      res.cookie("jwt", token,{
          maxAge:3*24 * 60 * 60*1000,
          secure:true,
          sameSite :"None"
      });
      return res.status(200).json({ user:{
          id:user.id,
          email:user.email,
          profileSetup:user.profileSetup,
          firstName:user.firstName,
          lastName:user.lastName,
          image:user.image,
          color:user.color
      },
   });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal Server Error");
    }
  };