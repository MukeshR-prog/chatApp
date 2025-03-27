import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel, getUserChannel } from "../controllers/channelController.js";


const channelRoutes = Router();

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channels",verifyToken,getUserChannel)

export default channelRoutes;