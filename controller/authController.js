import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import sendEmail from '../config/nodemailer.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: 'Missing Details!!'
        });
    }

    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.json({
                success: false,
                message: 'User already exists!!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });
        user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await sendEmail({
            to: email,
            subject: "Welcome to Emotion Lense",
            text: `Welcome to MERN_AUTH. Your Profile has been created with email id : ${email}`
        });

        return res.json({
            success: true,
            message: 'You profile is created successfully'
        });

    } catch (error) {
        res.json({ success: false, message: `Register User Error: ${error.message}` });
    }
}