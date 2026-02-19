import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import youtubeRouter from './routes/youtubeRoutes.js';
import groqRouter from './routes/groqRoutes.js';

const app = express();

const port = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:true,
    credentials:true
}));

app.get('/', (req, res)=>{
    res.send("API is working...");
});

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/groq/', groqRouter);

app.listen(port, ()=>{
    console.log("Server is running on port : ", port);
})