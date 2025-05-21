import express, { urlencoded } from 'express'
import { allusers,getMessages, sendMessage } from '../controllers/messages.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router()

router.get("/user", protectRoute, allusers);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id",protectRoute,sendMessage)


export default router;