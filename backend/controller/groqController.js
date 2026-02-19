import { generateTextFromGroq } from "../services/groqService.js";
import { groqPromt } from "../utils/groqPrompt.js";
import analysisModel from "../model/analysisModel.js";
import videoMetaDataModel from "../model/videoMetaDataModel.js";
import { extractVideoId } from "../services/youtubeService.js";

export const generateAnalysisSummary = async (req, res) => {
    try {
        const { youtubeUrl } = req.body;

        if (!youtubeUrl) {
            return res.json({
                success: false,
                message: 'youtubeUrl is required!!'
            });
        }

        const videoId = extractVideoId(youtubeUrl);

        // Run both queries in parallel — videoId on analysisModel avoids the
        // sequential dependency (previously had to fetch metaData first just to
        // get its _id, then use it to look up analysis).
        const [metaData, analysis] = await Promise.all([
            videoMetaDataModel
                .findOne({ videoId, userId: req.userId })
                .sort({ createdAt: -1 }),
            analysisModel
                .findOne({ videoId, userId: req.userId })
                .sort({ createdAt: -1 })
        ]);

        if (!metaData) {
            return res.json({
                success: false,
                message: 'Video metadata not found!! Please fetch the video first.'
            });
        }

        if (!analysis) {
            return res.json({
                success: false,
                message: 'Analysis record not found!! Please analyze the video first.'
            });
        }

        const analysisData = {
            title:        metaData.title       ?? 'N/A',
            channelName:  metaData.channelName ?? 'N/A',
            totalComments: analysis.totalComments,
            sentimentPositivePercentage: analysis.sentimentPositivePercentage,
            sentimentNeutralPercentage:  analysis.sentimentNeutralPercentage,
            sentimentNegativePercentage: analysis.sentimentNegativePercentage,
            emotionJoyPercentage:        analysis.emotionJoyPercentage,
            emotionAngerPercentage:      analysis.emotionAngerPercentage,
            emotionSadnessPercentage:    analysis.emotionSadnessPercentage,
            emotionFearPercentage:       analysis.emotionFearPercentage,
            emotionSurprisePercentage:   analysis.emotionSurprisePercentage,
            emotionDisgustPercentage:    analysis.emotionDisgustPercentage,
            topPositiveComments: analysis.topPositiveComments ?? [],
            topNegativeComments: analysis.topNegativeComments ?? [],
        };

        const prompt = groqPromt(analysisData);

        console.log("Prompt : ", prompt)

        const summary = await generateTextFromGroq(prompt);

        console.log("Summary : ", summary);

        await analysisModel.findByIdAndUpdate(analysis._id, { summary });

        return res.json({
            success: true,
            summary,
            message: 'Analysis Summary Generated Successfully!!'
        });
    } catch (error) {
        return res.json({
            success: false,
            message: `Groq Controller Error : ${error.message}`
        });
    }
}