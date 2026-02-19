import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    videoMetaDataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videoMetaData',
        required: true
    },
    totalComments: {
        type: Number,
        required: true
    },
    sentimentPositiveCount: {
        type: Number,
        default: 0
    },
    sentimentPositivePercentage: {
        type: Number,
        default: 0
    },
    sentimentNeutralCount: {
        type: Number,
        default: 0
    },
    sentimentNeutralPercentage: {
        type: Number,
        default: 0
    },
    sentimentNegativeCount: {
        type: Number,
        default: 0
    },
    sentimentNegativePercentage: {
        type: Number,
        default: 0
    },
    emotionJoyCount: {
        type: Number,
        default: 0
    },
    emotionJoyPercentage: {
        type: Number,
        default: 0
    },
    emotionAngerCount: {
        type: Number,
        default: 0
    },
    emotionAngerPercentage: {
        type: Number,
        default: 0
    },
    emotionSadnessCount: {
        type: Number,
        default: 0
    },
    emotionSadnessPercentage: {
        type: Number,
        default: 0
    },
    emotionFearCount: {
        type: Number,
        default: 0
    },
    emotionFearPercentage: {
        type: Number,
        default: 0
    },
    emotionSurpriseCount: {
        type: Number,
        default: 0
    },
    emotionSurprisePercentage: {
        type: Number,
        default: 0
    },
    emotionDisgustCount: {
        type: Number,
        default: 0
    },
    emotionDisgustPercentage: {
        type: Number,
        default: 0
    },
    dominantSentimentLabel: {
        type: String,
        default: null
    },
    dominantSentimentCount: {
        type: Number,
        default: 0
    },
    dominantEmotionLabel: {
        type: String,
        default: null
    },
    dominantEmotionCount: {
        type: Number, default: 0
    },
    summary: {
        type: String,
        default: ''
    },

    topPositiveComments: [
        {
            text: { type: String, required: true },
            emotion: {
                label: { type: String, default: null },
                value: { type: Number, default: 0 }
            },
            sentiment: {
                label: { type: String, default: null },
                value: { type: Number, default: 0 }
            }
        }
    ],

    topNegativeComments: [
        {
            text: { type: String, required: true },
            emotion: {
                label: { type: String, default: null },
                value: { type: Number, default: 0 }
            },
            sentiment: {
                label: { type: String, default: null },
                value: { type: Number, default: 0 }
            }
        }
    ],

}, { timestamps: true });

const analysisModel = mongoose.models.analysis || mongoose.model('analysis', analysisSchema);

export default analysisModel;
