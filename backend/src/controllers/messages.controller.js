import cloudinary from "../lib/cloudinary.js";
import db from "../lib/db.js"

export const allusers = async (req, res) => {
    
try {
    
    const logged_in_user = req.user.fullname
    const not_user = await db.query("select fullname,id,email,profile_pic from users where fullname!=$1", [logged_in_user]);

    res.status(201).json(not_user.rows)

} catch (error) {
    console.error(error)
    res.status(400).json({message:"internal server error"})
}

}

export const getMessages = async (req, res) => {
    try {
        
        const { id:senderid } = req.params;
        const userownid = req.user.id;
        const allmessages = await db.query("select * from messages where (sender_id=$1 and receiver_id=$2)or(sender_id=$2 and receiver_id=$1) order by sent_at ASC", [senderid, userownid]);

        res.status(201).json({
            message
            :allmessages.rows
        })


    } catch (error) {
        console.error(error.message)
        res.status(400).json({ message: "internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body
        const { id: receiver_id } = req.params
        const sender_id = req.user.id;

        let imageUrl;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image)
            imageUrl = uploadedImage.secure_url;
        }
        const newMessage = new Message({
            sender_id,receiver_id,text,image:imageUrl
        })

        // this is remaining to add
        
res.status(201).json({message:newMessage})

    } catch (error) {
        console.error(error.message)
        res.status(400).json({ message: "internal server error" });

    }
}