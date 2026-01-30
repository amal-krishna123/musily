import mongoose from "mongoose";

const songsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    songURL: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
    }
}, {timestamps: true});

export const Song = mongoose.model("Song", songsSchema);