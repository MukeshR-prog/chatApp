import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { SearchContact } from "../controllers/contactsController.js";
const contactRoute = Router();

contactRoute.post('/search',verifyToken,SearchContact)


export default contactRoute;