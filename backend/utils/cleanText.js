// Remove URLs from text
export const removeUrls = (text) => {
    return text.replace(/https?:\/\/[^\s]+|www\.[^\s]+/g, '').trim();
};

// Remove emojis from text
export const removeEmojis = (text) => {
    return text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emoji ranges
        .replace(/[\u{2600}-\u{27BF}]/gu, '') // Miscellaneous Symbols
        .replace(/[\u{2300}-\u{23FF}]/gu, '') // Miscellaneous Technical
        .replace(/[\u{2000}-\u{206F}]/gu, '') // General Punctuation
        .trim();
};

// Remove HTML tags and special characters
export const removeHtmlTags = (text) => {
    return text.replace(/<[^>]*>/g, '').trim();
};

// Remove extra whitespace
export const removeExtraWhitespace = (text) => {
    return text.replace(/\s+/g, ' ').trim();
};

// Keep only Hindi and English text
export const keepHindiEnglishOnly = (text) => {
    // Allow English letters (a-z, A-Z), numbers (0-9), Hindi characters, spaces, and basic punctuation
    // Hindi Unicode range: \u0900-\u097F
    return text
        .replace(/[^\u0900-\u097Fa-zA-Z0-9\s।,.:;!?'"()\-]/g, '')
        .trim();
};

// Main cleaning function - combines all cleaning operations
export const cleanCommentText = (text) => {
    if (!text || typeof text !== 'string') {
        return '';
    }

    let cleaned = text;
    
    // Remove HTML tags
    cleaned = removeHtmlTags(cleaned);
    
    // Remove URLs
    cleaned = removeUrls(cleaned);
    
    // Remove emojis
    cleaned = removeEmojis(cleaned);
    
    // Keep only Hindi and English text
    cleaned = keepHindiEnglishOnly(cleaned);
    
    // Remove extra whitespace
    cleaned = removeExtraWhitespace(cleaned);
    
    return cleaned;
};

// Batch clean multiple comments
export const cleanComments = (comments) => {
    if (!Array.isArray(comments)) {
        return [];
    }

    return comments
        .map(comment => cleanCommentText(comment))
        .filter(comment => comment.length > 0); // Remove empty comments
};
