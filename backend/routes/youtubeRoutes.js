import express from 'express';
import { getComments } from '../controller/youtubeController.js';
import { analyzeComments } from '../controller/youtubeController.js';
import { userAuth } from '../middleware/userAuth.js';



const youtubeRouter = express.Router();

youtubeRouter.post('/get-comments', userAuth, getComments);
youtubeRouter.post('/analyze', userAuth, analyzeComments);

export default youtubeRouter;
