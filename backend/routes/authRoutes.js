import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { login, logout, me, register, resetPassword, sendResetOtp } from '../controller/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userAuth, logout);
authRouter.get('/me', userAuth, me);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;