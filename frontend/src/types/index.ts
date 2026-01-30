export interface Song {
    _id: string;
    title: string;
    artist: string;
    albumId: string | null; // albumId can be null if the song is not part of an album
    duration: number; // duration in seconds
    songURL: string; // URL to the song file
    imageURL: string; // URL to the song's image/album art
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface Album {
    _id: string;
    title: string;
    artist: string;
    imageURL: string; // URL to the album's image/cover art
    releaseYear: number;
    songs: Song[]; // Array of songs in the album
}

export interface Stats {
    totalSongs: number;
    totalAlbums: number;
    totalUsers: number;
    totalArtists: number;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    clerkId: string;
    fullName: string;
    imageUrl: string;
}