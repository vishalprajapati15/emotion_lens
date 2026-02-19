import mongoose from "mongoose";

const videoMetaDataSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    videoId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    publishedAt: {
        type: Date,
        default: null
    },

}, { timestamps: true });

const videoMetaDataModel = mongoose.models.videoMetaData || mongoose.model('videoMetaData', videoMetaDataSchema);

export default videoMetaDataModel;
