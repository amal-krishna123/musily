import {Song} from '../model/song.model.js';
import {Album} from '../model/album.model.js';
import cloudinary from '../lib/cloudinary.js';
import { clerkClient } from "@clerk/express";

//helper function to upload files to cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.log("Error uploading to Cloudinary:", error);
        throw new Error("File upload failed");
    }
}

export const createSong = async (req, res, next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message: "please upload the files"});
        }
        const {title, artist, duration, albumId} = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const songURL = await uploadToCloudinary(audioFile);
        const imageURL = await uploadToCloudinary(imageFile);

        const song= new Song({
            title,
            artist,
            songURL,
            imageURL,
            duration,
            albumId : albumId || null,
        });

        await song.save();

        if(albumId){
            // Update album with the new song if it belongs to any album
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }
        res.status(201).json({message: "song created successfully", song});

    } catch (error) {
        console.log("Error in createSong:", error);
        next(error);
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);

        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            });
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });

    } catch (error) {
        console.log("Error in deleteSong:", error);
        next(error);
    }
};

export const createAlbum = async (req,res,next) => {
    try {
        const {title, artist, releaseYear} = req.body;
        const {imageFile} = req.files;

        const imageURL = await uploadToCloudinary(imageFile);
        const album = new Album({
            title,
            artist,
            releaseYear,
            imageURL,
        });
        await album.save();
        res.status(201).json({message: "album created successfully", album});

    } catch (error) {
        console.log("Error in createAlbum:", error);
        next(error);
    }
};

export const deleteAlbum = async (req,res,next) => {
    try {
        const { id } = req.params;

        await Song.deleteMany({ albumId: id });
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: "Album and its songs deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum:", error);
        next(error);
    }
};

export const checkAdmin = async (req, res, next) => {
    try {
        if(!req.auth?.userId) {
            return res.status(200).json({ isAdmin: false });
        }

        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

        res.status(200).json({ isAdmin });
    } catch (error) {
        console.log("Error in checkAdmin:", error);
        res.status(200).json({ isAdmin: false });
    }
};