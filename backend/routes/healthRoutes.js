import express from 'express';

const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
    console.log('Health check requested!');
    res.status(200).json({
        status: 'OK',
        success: true,
        message: 'Server is awake!',
        timestamp: new Date()
    });
});
export default healthRouter;