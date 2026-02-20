import express from 'express';
import { generateAnalysisSummary, generateSummaryById } from '../controller/groqController.js';
import {userAuth} from '../middleware/userAuth.js'

const groqRouter = express.Router();

groqRouter.post('/generate-summary', userAuth, generateAnalysisSummary);
groqRouter.post('/generate-summary-by-id', userAuth, generateSummaryById);

export default groqRouter;