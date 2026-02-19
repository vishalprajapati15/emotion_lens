export const groqPromt = (data) => {

    const topPositive = Array.isArray(data.topPositiveComments) ? data.topPositiveComments : [];
    const topNegative = Array.isArray(data.topNegativeComments) ? data.topNegativeComments : [];

    return `
You are an advanced YouTube analytics AI.
Generate a professional analysis report based on the following data:

Video Title: ${data.title || 'N/A'}
Channel Name: ${data.channelName || 'N/A'}
Total Comments: ${data.totalComments || 'N/A'}

Sentiment Distribution:
Positive: ${data.sentimentPositivePercentage ?? 0}%
Neutral:  ${data.sentimentNeutralPercentage  ?? 0}%
Negative: ${data.sentimentNegativePercentage ?? 0}%

Emotion Distribution:
Joy:      ${data.emotionJoyPercentage      ?? 0}%
Anger:    ${data.emotionAngerPercentage    ?? 0}%
Sadness:  ${data.emotionSadnessPercentage  ?? 0}%
Fear:     ${data.emotionFearPercentage     ?? 0}%
Surprise: ${data.emotionSurprisePercentage ?? 0}%
Disgust:  ${data.emotionDisgustPercentage  ?? 0}%

Top Positive Comments:
${topPositive.length ? topPositive.map(c => `- "${c.text}" [emotion: ${c.emotion?.label ?? 'N/A'} (${c.emotion?.value ?? 0})]`).join('\n') : '- No positive comments available'}

Top Negative Comments:
${topNegative.length ? topNegative.map(c => `- "${c.text}" [emotion: ${c.emotion?.label ?? 'N/A'} (${c.emotion?.value ?? 0})]`).join('\n') : '- No negative comments available'}

Provide:
1. Overall audience reaction
2. Emotional trends
3. Key concerns
4. Engagement insight
5. Final conclusion
6. Improvement Opportunities for Creator
`;
};