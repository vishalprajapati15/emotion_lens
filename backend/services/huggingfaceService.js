import hf, { models } from "../config/huggingface.js";

const MAX_CHARS = 1800;            //Models have a 512-token limit(1800 chars is a safe)
const BATCH_SIZE = 32;              // batch size

const truncate = (text) =>
    typeof text === 'string' ? text.slice(0, MAX_CHARS) : '';

// Process in batches to avoid overloading the API
const runInBatches = async (model, texts) => {
    const results = [];
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE).map(truncate);
        const batchResults = await hf.textClassification({
            model,
            inputs: batch,
        });
        results.push(...(Array.isArray(batchResults) ? batchResults : [batchResults]));
    }
    return results;
};

export const analyzeSentiment = async (texts) => {
    try {
        return await runInBatches(models.sentiment, texts);
    } catch (error) {
        const detail = error?.message || error.toString();
        throw new Error(`Hugging Face Sentiment Error: ${detail}`);
    }
};

export const analyzeEmotion = async (texts) => {
    try {
        return await runInBatches(models.emotion, texts);
    } catch (error) {
        const detail = error?.message || error.toString();
        throw new Error(`Hugging Face Emotion Error: ${detail}`);
    }
};
