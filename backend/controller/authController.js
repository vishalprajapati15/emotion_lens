import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import sendEmail from '../config/nodemailer.js';
import { PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE } from '../config/emailTemplets.js'

export const register = async (req, res) => {
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
        await user.save();

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
            // text: `Welcome to MERN_AUTH. Your Profile has been created with email id : ${email}`,
            html: WELCOME_TEMPLATE
            .replace('{{username}}', user.name)
            // .replace("{{loginLink}}", "https://emotionlense.com/dashboard")
        });

        return res.json({
            success: true,
            message: 'You profile is created successfully'
        });

    } catch (error) {
        res.json({ success: false, message: `Register User Error: ${error.message}` });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: 'Missing Details!!'
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User with this email does not exist!!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid Password!!'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: 'User Logged in Successfully!!'
        });
    } catch (error) {
        res.json({ success: false, message: `Login User Error: ${error.message}` });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({
            success: true,
            message: 'User Logged Out Succesfully!!'
        });
    } catch (error) {
        res.json({ success: false, message: `Logout User Error: ${error.message}` });
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            message: 'Email address is required!!'
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found!!'
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendEmail({
            to: user.email,
            subject: 'Password Reset OTP',
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp)
        });

        return res.json({
            success: true,
            message: 'OTP sent successfully!!'
        });
        
    } catch (error) {
        res.json({ success: false, message: `Send reset OTP Error: ${error.message}` });
    }
}

export const resetPassword = async (req, res)=>{
    const {otp, email, newPassword} = req.body;
    if (!otp || !email || !newPassword) {
        return res.json({
            success: false,
            message: 'Missing Details!!'
        });
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({
                success: false,
                message: 'User with this email does not exist!!'
            });
        }

        const normalizedOtp = String(otp).trim();
        if (user.resetOtp !== normalizedOtp) {
            return res.json({ success: false, message: 'Invalid OTP!!' });
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({ success: false, message: 'OTP is Expired!!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt= 0;

        await user.save();

        res.json({success: true, message:'Password has been reset successfully!!'})
    } catch (error) {
        res.json({ success: false, message: ` Reset password Error: ${error.message}` });
    }
}