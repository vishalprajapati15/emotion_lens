import { extractVideoId, getYoutubeComments } from '../services/youtubeService.js';
import { analyzeSentiment, analyzeEmotion } from '../services/huggingfaceService.js';

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

        // Extract video ID from the URL
        const videoId = extractVideoId(youtubeUrl);
        console.log("videoId : ", videoId)

        // Fetch comments using the video ID
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

        const comments = await getYoutubeComments(videoId);

        if (!comments || comments.length === 0) {
            return res.json({
                success: false,
                message: "No comments found for this video!!"
            });
        }

        const sentiments = await analyzeSentiment(comments);
        console.log("sentiments : ", sentiments);
        const emotions = await analyzeEmotion(comments);
        console.log("emotions : ", emotions);

        const stats = {
            totalComments: comments.length,
            sentiment: {},
            emotion: {}
        };

        // Handle both single result and array of results
        if (Array.isArray(sentiments)) {
            sentiments.forEach((result) => {
                if (result && Array.isArray(result)) {
                    const label = result[0]?.label;
                    if (label) {
                        stats.sentiment[label] = (stats.sentiment[label] || 0) + 1;
                    }
                } else if (result?.label) {
                    stats.sentiment[result.label] = (stats.sentiment[result.label] || 0) + 1;
                }
            });
        }

        if (Array.isArray(emotions)) {
            emotions.forEach((result) => {
                if (result && Array.isArray(result)) {
                    const label = result[0]?.label;
                    if (label) {
                        stats.emotion[label] = (stats.emotion[label] || 0) + 1;
                    }
                } else if (result?.label) {
                    stats.emotion[result.label] = (stats.emotion[result.label] || 0) + 1;
                }
            });
        }

        const statsPercentage = (data, total) => {
            const formatted = {};
            for (let key in data) {
                formatted[key] = {
                    count: data[key],
                    percentage: ((data[key] / total) * 100).toFixed(2)
                };
            }
            return formatted;
        }

        const getDominantStat = (data) => {
            let dominantKey = null;
            let dominantValue = 0;
            for (let key in data) {
                if (data[key].count > dominantValue) {
                    dominantValue = data[key].count;
                    dominantKey = key;
                }
            };
            return {
                label: dominantKey,
                count: dominantValue
            };
        }

        stats.emotion = statsPercentage(stats.emotion, stats.totalComments);
        stats.sentiment = statsPercentage(stats.sentiment, stats.totalComments);
        console.log("Stats : ", stats);

        const dominantEmotion = getDominantStat(stats.emotion);
        console.log("Dominant Emotion : ", dominantEmotion);
        const dominantSentiment = getDominantStat(stats.sentiment);
        console.log("Dominant Sentiment : ", dominantSentiment);

        return res.json({
            success: true,
            videoId,
            totalComments: comments.length,
            statistics: stats,
            dominantEmotion,
            dominantSentiment,
            message: "Comments analyzed successfully!!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Comments Analysis Error: ${error.message}`
        });
    }
}
