import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import youtubeRouter from './routes/youtubeRoutes.js';
import groqRouter from './routes/groqRoutes.js';
import videoRouter from './routes/videoRoutes.js';
import healthRouter from './routes/healthRoutes.js';

const app = express();

const port = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
    'https://emotion-lense.vercel.app',       // allow requests with no origin like mobile apps or curl
    'http://localhost:5173'
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.get('/', (req, res) => {
    res.send("API is working...");
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/groq/', groqRouter);
app.use('/api/videos', videoRouter);

app.listen(port, () => {
    console.log("Server is running on port : ", port);
})