export const formatGroqText = (text) => {
    if (!text || typeof text !== 'string') return '';

    let out = text;

    // 1. Remove fenced code blocks (```…```)
    out = out.replace(/```[\s\S]*?```/g, '');

    // 2. Remove inline code (`…`)
    out = out.replace(/`[^`]*`/g, (m) => m.slice(1, -1));

    // 3. Convert markdown headers (## Title) → ALL-CAPS title line
    out = out.replace(/^#{1,6}\s+(.+)$/gm, (_, title) => title.toUpperCase());

    // 4. Remove horizontal rules
    out = out.replace(/^(\*{3,}|-{3,}|_{3,})\s*$/gm, '');

    // 5. Bold / italic markers  (**text**, __text__, *text*, _text_)
    out = out.replace(/(\*\*|__)(.*?)\1/g, '$2');   // bold
    out = out.replace(/(\*|_)(.*?)\1/g, '$2');       // italic

    // 6. Normalise bullet / list markers (-, *, •, >) → "• "
    out = out.replace(/^[ \t]*[-*•>]\s+/gm, '• ');

    // 7. Clean numbered list markers that have extra spaces
    out = out.replace(/^[ \t]*(\d+)\.\s+/gm, '$1. ');

    // 8. Strip trailing whitespace from every line
    out = out.replace(/[ \t]+$/gm, '');

    // 9. Collapse 3+ consecutive blank lines → 2 blank lines (one empty line)
    out = out.replace(/\n{3,}/g, '\n\n');

    // 10. Final trim
    return out.trim();
};

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
