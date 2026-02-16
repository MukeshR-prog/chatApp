import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  createChannel, 
  getChannelMessages, 
  getUserChannel,
  getChannelDetails,
  updateChannelMembers,
  addChannelMember,
  removeChannelMember
} from "../controllers/channelController.js";


const channelRoutes = Router();

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channels",verifyToken,getUserChannel)
channelRoutes.get("/get-channal-messages/:channelId",verifyToken,getChannelMessages)
channelRoutes.get("/get-channel-details/:channelId",verifyToken,getChannelDetails)
channelRoutes.put("/update-channel-members/:channelId",verifyToken,updateChannelMembers)
channelRoutes.post("/add-channel-member/:channelId",verifyToken,addChannelMember)
channelRoutes.post("/remove-channel-member/:channelId",verifyToken,removeChannelMember)

export default channelRoutes;