import express from 'express';
import { getComments, getVideoMetaData } from '../controller/youtubeController.js';
import { analyzeComments } from '../controller/huggingfaceController.js';
import { userAuth } from '../middleware/userAuth.js';

const youtubeRouter = express.Router();

youtubeRouter.post('/get-comments', userAuth, getComments);
youtubeRouter.post('/analyze', userAuth, analyzeComments);
youtubeRouter.post('/video-meta-data', userAuth, getVideoMetaData);

export default youtubeRouter;
