import { getCommentUrl } from '../config/youtube.js';
import { cleanCommentText } from '../utils/cleanText.js';

// Extract video ID from various YouTube URL formats
export const extractVideoId = (youtubeUrl) => {
    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
        throw new Error('Invalid YouTube URL');
    }

    // Match patterns: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
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
        .filter(comment => comment.length > 0); // Remove empty comments after cleaning
}