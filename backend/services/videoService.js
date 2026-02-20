import analysisModel from "../model/analysisModel.js";

export const getCardPreviewData = async (userId) => {
    const analysis = await analysisModel
        .find({ userId })
        .populate({
            path: "videoMetaDataId",
            select: "title channelName thumbnail views likes publishedAt"
        }).
        select(
            "videoId videoMetaDataId totalComments dominantSentimentLabel dominantEmotionLabel sentimentPositivePercentage sentimentNegativePercentage"
        )
        .sort({ createdAt: -1 })
        .lean();

    if (!analysis || analysis.length === 0) {
        return [];
    }

    return analysis.map((item) => ({
        videoId: item.videoId,
        title: item.videoMetaDataId?.title,
        channelName: item.videoMetaDataId?.channelName,
        thumbnail: item.videoMetaDataId?.thumbnail,
        views: item.videoMetaDataId?.views,
        likes: item.videoMetaDataId?.likes,
        publishedAt: item.videoMetaDataId?.publishedAt,
        totalComments: item.totalComments,
        dominantSentiment: item.dominantSentimentLabel,
        dominantEmotion: item.dominantEmotionLabel,
        positivePercentage: item.sentimentPositivePercentage,
        negativePercentage: item.sentimentNegativePercentage
    }));
};

export const getFullVideoAndAnalysisDetails = async (userId, videoId) => {
    const analysis = await analysisModel
        .findOne({ userId, videoId })
        .populate("videoMetaDataId")
        .lean();

    if (!analysis) {
        throw new Error("Video Analysis not found!!");
    }

    return analysis;

};