import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getContactsForDMList, SearchContact } from "../controllers/contactsController.js";
const contactRoute = Router();

contactRoute.post('/search',verifyToken,SearchContact)
contactRoute.get('/get-contacts-for-dm',verifyToken,getContactsForDMList)

export default contactRoute;