import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import messageRoutes from  './routes/messages.route.js'
import  cors  from 'cors'

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials:true
        
    }
))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);




app.listen(port, () =>
    console.log(`server running on port ${port}👍🏻`))