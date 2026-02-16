import userModel from "../model/userModel.js";

export const getUserData = async (req, res)=>{
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found!!' });
        }

        res.json({
            success: true,
            name: user.name
        });
    } catch (error) {
        res.json({ success: false, message: `Fetch User Data Error: ${error.message}` });
    }
}