import jwt from 'jsonwebtoken'
import db from '../lib/db.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv' 

dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - invalid token" });
        }

        const user = await db.query(
            "SELECT id, email, fullname, profile_pic FROM users WHERE id=$1",
            [decoded.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};