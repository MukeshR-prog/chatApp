import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getAllContacts, getContactsForDMList, SearchContact } from "../controllers/contactsController.js";
const contactRoute = Router();

contactRoute.post('/search',verifyToken,SearchContact)
contactRoute.get('/get-contacts-for-dm',verifyToken,getContactsForDMList)
contactRoute.get('/get-all-contacts',verifyToken,getAllContacts)
export default contactRoute;