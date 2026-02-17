export const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/commentThreads";

export const getCommentUrl = (videoId, maxResults = 100)=>{
    return `${YOUTUBE_BASE_URL}?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${process.env.YOUTUBE_API_KEY}`;
}