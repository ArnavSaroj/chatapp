import express from 'express'
import { logout, signup, login,update_profile,checkRoute } from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup",signup )

router.post("/login", login)

router.post("/logout", logout)


router.put("/update_profile", protectRoute, update_profile);

router.get("/check",protectRoute,checkRoute)


export default router;