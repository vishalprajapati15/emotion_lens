import { getCommentUrl } from '../config/youtube.js';
import { cleanCommentText } from '../utils/cleanText.js';


export const extractVideoId = (youtubeUrl) => {
    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
        throw new Error('Invalid YouTube URL');
    }

    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = youtubeUrl.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    throw new Error('Invalid YouTube URL format');
};

export const getYoutubeComments = async (videoId) => {
    const url = getCommentUrl(videoId);
    const response = await fetch(url);

    const data = await response.json();

    if (!data.items) {
        throw new Error('No comments found!!');
    }

    return data.items
        .map((item) => {
            const commentText = item.snippet.topLevelComment.snippet.textDisplay;
            return cleanCommentText(commentText);
        })
        .filter(comment => comment.length > 0)
}

export const getYoutubeVideoDetails = async (videoId) => {
    if (!videoId) {
        throw new Error("Video ID is required");
    }

    const api_key = process.env.YOUTUBE_API_KEY;

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("Video Not found!!");
    }

    const video = data.items[0];

    const snippet = video.snippet;

    const stats = video.statistics

    return {
        videoId,
        title: snippet.title,
        channelName: snippet.channelTitle,
        thumbnail:
            snippet.thumbnails?.maxres?.url ||
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url,
        views: Number(stats.viewCount) || 0,
        likes: Number(stats.likeCount) || 0,
        commentCount: Number(stats.commentCount) || 0,
        publishedAt: snippet.publishedAt
    };
};