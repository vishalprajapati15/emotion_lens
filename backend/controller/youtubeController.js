import { extractVideoId, getYoutubeComments, getYoutubeVideoDetails } from '../services/youtubeService.js';
import videoMetaDataModel from '../model/videoMetaDataModel.js';

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

export const getVideoMetaData = async (req, res)=>{
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

        if(!videoMetaData){
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
