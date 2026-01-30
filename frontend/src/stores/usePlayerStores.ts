import type { Song } from "@/types";
import { create } from "zustand";
import { useChatStore } from "./useChatStores";

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number, userId?: string) => void;
	setCurrentSong: (song: Song | null, userId?: string) => void;
	togglePlay: (userId?: string) => void;
	playNext: (userId?: string) => void;
	playPrevious: (userId?: string) => void;
}

// Helper function to emit activity update
const emitActivityUpdate = (song: Song | null, isPlaying: boolean, userId: string | undefined) => {
	if (!userId) return;
	
	const { socket } = useChatStore.getState();
	if (!socket) return;

	let activity = "Idle";
	if (isPlaying && song) {
		activity = `Playing ${song.title} by ${song.artist}`;
	}

	socket.emit("update_activity", { userId, activity });
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs: Song[]) => {
        set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
    },

    playAlbum: (songs: Song[], startIndex=0, userId?: string) => {
        if(songs.length===0) return;

        const song = songs[startIndex];
        set({
            queue:songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
        });
        
        emitActivityUpdate(song, true, userId);
    },

	setCurrentSong: (song: Song | null, userId?: string) => {
        if(!song) return;

        const songIndex = get().queue.findIndex((s) => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex!==-1 ? songIndex : get().currentIndex,
        });
        
        emitActivityUpdate(song, true, userId);
    },

	togglePlay: (userId?: string) => {
        const willStartPlaying = !get().isPlaying;
        const { currentSong } = get();

        set({isPlaying: willStartPlaying,});
        
        emitActivityUpdate(currentSong, willStartPlaying, userId);
    },

	playNext: (userId?: string) => {
        const { currentIndex, queue } = get();
		const nextIndex = currentIndex + 1;

		// if there is a next song to play, let's play it
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];
			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
            
            emitActivityUpdate(nextSong, true, userId);
		} else {
			// no next song
			set({ isPlaying: false });
            
            emitActivityUpdate(null, false, userId);
		}
    },
    
	playPrevious: (userId?: string) => {
        const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;

		// theres a prev song
		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
            
            emitActivityUpdate(prevSong, true, userId);
		} else {
			// no prev song
			set({ isPlaying: false });
            
            emitActivityUpdate(null, false, userId);
		}
    }, 
}))