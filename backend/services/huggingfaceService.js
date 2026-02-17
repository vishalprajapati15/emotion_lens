import hf, { models } from "../config/huggingface.js";

export const analyzeSentiment = async (texts)=>{
    try {
        const results = await hf.textClassification({
            model: models.sentiment,
            inputs: texts
        });
        return results;
    } catch (error) {
        const detail = error?.message || error.toString();
        throw new Error(`Hugging Face Sentiment Error: ${detail}`);
    }
};


export const analyzeEmotion = async (texts)=>{
    try {
        const results = await hf.textClassification({
            model: models.emotion,
            inputs: texts
        });
        return results;
    } catch (error) {
        const detail = error?.message || error.toString();
        throw new Error(`Hugging Face Emotion Error: ${detail}`);
    }
}
