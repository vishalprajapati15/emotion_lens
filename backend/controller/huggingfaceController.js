import { extractVideoId, getYoutubeComments } from '../services/youtubeService.js';
import { analyzeSentiment, analyzeEmotion } from '../services/huggingfaceService.js';
import analysisModel from '../model/analysisModel.js';
import videoMetaDataModel from '../model/videoMetaDataModel.js';

export const analyzeComments = async (req, res) => {
    try {
        const { youtubeUrl } = req.body;

        if (!youtubeUrl) {
            return res.json({
                success: false,
                message: "YouTube URL is required!!"
            });
        }

        const videoId = extractVideoId(youtubeUrl);

        const savedMetaData = await videoMetaDataModel.findOne({ videoId, userId: req.userId });

        if (!savedMetaData) {
            return res.json({
                success: false,
                message: "Video metadata not found!!"
            });
        }

        if (savedMetaData.commentCount === 0) {
            return res.json({
                success: false,
                message: "This video has no comments!!"
            });
        }

        const comments = await getYoutubeComments(videoId);

        if (!comments || comments.length === 0) {
            return res.json({
                success: false,
                message: "No comments found for this video!!"
            });
        }

        const sentiments = await analyzeSentiment(comments);
        console.log("sentiments : ", sentiments);

        const rawSentiment = {};
        if (Array.isArray(sentiments)) {
            sentiments.forEach((result) => {
                if (result && Array.isArray(result)) {
                    const label = result[0]?.label;
                    if (label) rawSentiment[label] = (rawSentiment[label] || 0) + 1;
                } else if (result?.label) {
                    rawSentiment[result.label] = (rawSentiment[result.label] || 0) + 1;
                }
            });
        }

        const statsPercentage = (data, total) => {
            const formatted = {};
            for (let key in data) {
                formatted[key] = {
                    count: data[key],
                    percentage: parseFloat(((data[key] / total) * 100).toFixed(2))
                };
            }
            return formatted;
        };

        const getDominantStat = (data) => {
            let dominantKey = null;
            let dominantValue = 0;
            for (let key in data) {
                if (data[key].count > dominantValue) {
                    dominantValue = data[key].count;
                    dominantKey = key;
                }
            }
            return { label: dominantKey, count: dominantValue };
        };

        const sentimentStats = statsPercentage(rawSentiment, comments.length);
        const dominantSentiment = getDominantStat(sentimentStats);
        console.log("Sentiment Stats : ", sentimentStats);

        // Save sentiment immediately after analyzeSentiment (upsert to avoid duplicates)
        const analysisDoc = await analysisModel.findOneAndUpdate(
            { userId: req.userId, videoId },
            {
                userId: req.userId,
                videoMetaDataId: savedMetaData._id,
                videoId,
                totalComments: comments.length,
                sentimentPositiveCount: sentimentStats.POSITIVE?.count ?? 0,
                sentimentPositivePercentage: sentimentStats.POSITIVE?.percentage ?? 0,
                sentimentNeutralCount: sentimentStats.NEUTRAL?.count ?? 0,
                sentimentNeutralPercentage: sentimentStats.NEUTRAL?.percentage ?? 0,
                sentimentNegativeCount: sentimentStats.NEGATIVE?.count ?? 0,
                sentimentNegativePercentage: sentimentStats.NEGATIVE?.percentage ?? 0,
                dominantSentimentLabel: dominantSentiment.label,
                dominantSentimentCount: dominantSentiment.count,
                // reset fields that will be recomputed or regenerated
                emotionJoyCount: 0,
                emotionJoyPercentage: 0,
                emotionAngerCount: 0,
                emotionAngerPercentage: 0,
                emotionSadnessCount: 0,
                emotionSadnessPercentage: 0,
                emotionFearCount: 0,
                emotionFearPercentage: 0,
                emotionSurpriseCount: 0,
                emotionSurprisePercentage: 0,
                emotionDisgustCount: 0,
                emotionDisgustPercentage: 0,
                dominantEmotionLabel: null,
                dominantEmotionCount: 0,
                topPositiveComments: [],
                topNegativeComments: [],
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const emotions = await analyzeEmotion(comments);
        console.log("emotions : ", emotions);

        const rawEmotion = {};
        if (Array.isArray(emotions)) {
            emotions.forEach((result) => {
                if (result && Array.isArray(result)) {
                    const label = result[0]?.label;
                    if (label) rawEmotion[label] = (rawEmotion[label] || 0) + 1;
                } else if (result?.label) {
                    rawEmotion[result.label] = (rawEmotion[result.label] || 0) + 1;
                }
            });
        }

        const emotionStats = statsPercentage(rawEmotion, comments.length);
        const dominantEmotion = getDominantStat(emotionStats);
        console.log("Emotion Stats : ", emotionStats);

        const commentSentimentLabels = sentiments.map((result) => {
            if (Array.isArray(result)) return result[0];
            return result;
        });

        const commentEmotionLabels = emotions.map((result) => {
            if (Array.isArray(result)) return result[0];
            return result;
        });

        const buildComment = (text, i) => ({
            text,
            emotion: {
                label: commentEmotionLabels[i]?.label ?? null,
                value: parseFloat((commentEmotionLabels[i]?.score ?? 0).toFixed(4))
            },
            sentiment: {
                label: commentSentimentLabels[i]?.label ?? null,
                value: parseFloat((commentSentimentLabels[i]?.score ?? 0).toFixed(4))
            }
        });

        const topPositive = comments
            .map((text, i) => buildComment(text, i))
            .filter(c => c.sentiment.label === 'POSITIVE')
            .slice(0, 5);

        const topNegative = comments
            .map((text, i) => buildComment(text, i))
            .filter(c => c.sentiment.label === 'NEGATIVE')
            .slice(0, 5);

        // save with emotion immediately after analyzeEmotion
        await analysisModel.findOneAndUpdate({ userId: req.userId, videoId }, {
            emotionJoyCount: emotionStats.joy?.count ?? 0,
            emotionJoyPercentage: emotionStats.joy?.percentage ?? 0,
            emotionAngerCount: emotionStats.anger?.count ?? 0,
            emotionAngerPercentage: emotionStats.anger?.percentage ?? 0,
            emotionSadnessCount: emotionStats.sadness?.count ?? 0,
            emotionSadnessPercentage: emotionStats.sadness?.percentage ?? 0,
            emotionFearCount: emotionStats.fear?.count ?? 0,
            emotionFearPercentage: emotionStats.fear?.percentage ?? 0,
            emotionSurpriseCount: emotionStats.surprise?.count ?? 0,
            emotionSurprisePercentage: emotionStats.surprise?.percentage ?? 0,
            emotionDisgustCount: emotionStats.disgust?.count ?? 0,
            emotionDisgustPercentage: emotionStats.disgust?.percentage ?? 0,
            dominantEmotionLabel: dominantEmotion.label,
            dominantEmotionCount: dominantEmotion.count,
            topPositiveComments: topPositive,
            topNegativeComments: topNegative,
        });

        const stats = {
            totalComments: comments.length,
            sentiment: sentimentStats,
            emotion: emotionStats,
        };

        return res.json({
            success: true,
            analysisId: analysisDoc._id,
            videoId,
            totalComments: comments.length,
            statistics: stats,
            dominantEmotion,
            dominantSentiment,
            topPositiveComments: topPositive,
            topNegativeComments: topNegative,
            summary: analysisDoc.summary ?? '',
            message: "Comments analyzed successfully!!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Huggingface Analysis Error: ${error.message}`
        });
    }
};
