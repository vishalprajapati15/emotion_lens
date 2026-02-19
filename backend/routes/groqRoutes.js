import express from 'express';
import { generateAnalysisSummary } from '../controller/groqController.js';
import {userAuth} from '../middleware/userAuth.js'

const groqRouter = express.Router();


groqRouter.post('/generate-summary', userAuth, generateAnalysisSummary);

export default groqRouter;