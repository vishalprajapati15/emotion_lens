import { extractVideoId, getYoutubeComments, getYoutubeVideoDetails } from '../services/youtubeService.js';
import videoMetaDataModel from '../model/videoMetaDataModel.js';
import analysisModel from '../model/analysisModel.js';

export const getComments = async (req, res) => {
    try {
        const { youtubeUrl } = req.body;
        console.log("Youtube : ", youtubeUrl)

        if (!youtubeUrl) {
            return res.json({
                success: false,
                message: 'YouTube URL is required!!'
            });
        }

        const videoId = extractVideoId(youtubeUrl);
        console.log("videoId : ", videoId)

        const comments = await getYoutubeComments(videoId);
        console.log("comments : ", comments)

        return res.json({
            success: true,
            videoId,
            comments,
            message: 'Comments fetched successfully!!'
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const getVideoMetaData = async (req, res) => {
    try {
        const { youtubeUrl } = req.body;

        if (!youtubeUrl) {
            return res.json({
                success: false,
                message: "YouTube URL is required!!"
            });
        }

        const videoId = extractVideoId(youtubeUrl);

        const videoMetaData = await getYoutubeVideoDetails(videoId);

        if (!videoMetaData) {
            return res.json({
                success: false,
                message: 'No video meta data found!!'
            });
        }

        const savedMetaData = await videoMetaDataModel.create({
            userId: req.userId,
            videoId: videoMetaData.videoId,
            title: videoMetaData.title,
            channelName: videoMetaData.channelName,
            thumbnail: videoMetaData.thumbnail,
            views: videoMetaData.views,
            likes: videoMetaData.likes,
            commentCount: videoMetaData.commentCount,
            publishedAt: videoMetaData.publishedAt,
        });

        return res.json({
            success: true,
            videoMetaData: savedMetaData,
            message: 'Video Meta Data Fetch successfully !!'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Fetch Video Meta Data Error: ${error.message}`
        });
    }
}

export const getVideoMetrics = async (req, res) => {
    try {
        const { youtubeUrl } = req.body;

        if (!youtubeUrl) {
            return res.json({
                success: false,
                message: "YouTube URL is required!!"
            });
        }

        const videoId = extractVideoId(youtubeUrl);

        if (!videoId) {
            return res.json({
                success: false,
                message: 'VideoId is required!!'
            });
        }

        const analysisData = await analysisModel.findOne({ videoId, userId: req.userId }).sort({ createdAt: -1 });
        if (!analysisData) {
            return res.json({
                success: false,
                message:'No analysis Data exist for this video Id'
            });
        }

        const total = analysisData.totalComments;
        const positive = analysisData.sentimentPositiveCount;
        const positivePercentage = analysisData.sentimentPositivePercentage;
        const negative = analysisData.sentimentNegativeCount;
        const negativePercentage = analysisData.sentimentNegativePercentage;

        const emotionCounts = {
            joy: analysisData.emotionJoyCount,
            anger: analysisData.emotionAngerCount,
            sadness: analysisData.emotionSadnessCount,
            fear: analysisData.emotionFearCount,
            surprise: analysisData.emotionSurpriseCount,
            disgust: analysisData.emotionDisgustCount
        }

        const totalEmotions = Object.values(emotionCounts).reduce(
            (sum, val)=> sum + val,
            0
        );

        const uniqueEmotions = Object.values(emotionCounts).filter(
            (val)=> val >0
        ).length;

        const dominantEmotion ={
            label: analysisData.dominantEmotionLabel,
            count: analysisData.dominantEmotionCount
        }

        const dominantSentiment = {
            label: analysisData.dominantSentimentLabel,
            count: analysisData.dominantSentimentCount
        }

        const satisfactionScore = positivePercentage - negativePercentage;

        const netSentimentScore = total > 0? (positive-negative)/total : 0;

        const positiveRatio = negative === 0 ? positive: positive/negative;

        const concentration = total>0? dominantEmotion.count / total :0;

        const negativeRiskIndex = total>0?(negativePercentage/100)*(emotionCounts.anger + emotionCounts.disgust)/100 : 0;

        return res.json({
            success: true,
            metrices:{
                satisfactionScore: Number(satisfactionScore.toFixed(2)),
                netSentimentScore: Number(netSentimentScore.toFixed(2)),
                positiveRatio: Number(positiveRatio.toFixed(2)),
                concentration: Number(concentration.toFixed(2)),
                negativeRiskIndex: Number(negativeRiskIndex.toFixed(2)),
            },
            message:'Metrics data generated successfully!!'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Get Video Metrics Error: ${error.message}`
        });
    }
} 
