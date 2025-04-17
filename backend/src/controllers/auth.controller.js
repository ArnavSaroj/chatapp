import bcrypt from "bcryptjs";
import db from "../lib/db.js";
import { generateToken } from "../lib/utilities.js";
import cloudinary from '../lib/cloudinary.js';


export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "all the fields must be filled" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const check_user_exists = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (check_user_exists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser_query = await db.query(
      "INSERT INTO users (email, fullname, password, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, email, fullname",
      [email, fullname, hashedPassword]
    );

    const newUser = newuser_query.rows[0];

    if (newUser) {
      generateToken(newUser.id, res);

      res.status(201).json({
        message: "user created succesfuly",
        id: newUser.id,
      });
    }
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user_exits = await db.query(
      "Select id,password,email from users where email=$1",
      [email]
    );

    if (user_exits.rows.length === 0) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const pswd_checker = await bcrypt.compare(
      password,
      user_exits.rows[0].password
    );
    if (!pswd_checker) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    generateToken(user_exits.rows[0].id, res);
    return res
      .status(200)
      .json({ message: "succesfuly logged in", id: user_exits.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "invalid credentials" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "succesfuly logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "some error ocurred try again!" });
  }
};

export const update_profile = async(req, res) => {
    try {
        const { profilePic } = req.body
        const user_id=req.user.id
        
if (!profilePic) {
    return res.status(400).json({ message: "profile pic is required" })
        }
        
        const photo_response = await cloudinary.uploader.upload(profilePic)
        

        const update_photo = await db.query(
            "UPDATE users SET profile_pic = $1 WHERE id = $2",
            [photo_response.secure_url, user_id]
        )
            
        if (update_photo.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
   
        res.status(200).json({ message: "Profile picture updated successfully"});

            
            ;
    } catch (error) {
        console.error(error);
    }
}

export const checkRoute = (req,res) => {
    try {
        
        res.status(200).json(req.user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
}