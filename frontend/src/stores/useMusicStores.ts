import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import { create } from "zustand";
import { toast } from "react-hot-toast";

interface MusicStore
 {
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    madeForYouSongs: Song[];
    featuredSongs: Song[];
    trendingSongs: Song[];
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (albumId: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats:{
        totalSongs:0,
        totalAlbums:0,
        totalArtists:0,
        totalUsers:0,
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/albums");
            set({ albums: response.data});
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch albums"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({error: message});
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (albumId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/albums/${albumId}`);
            set({ currentAlbum: response.data });
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch album"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch featured songs"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null});
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({trendingSongs: response.data});
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch trending songs"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch made for you songs"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs");
            set({ songs: response.data});
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch songs"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({error: message});
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/stats");
            set({ stats: response.data});
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error ? (error as any).response.data.message : "Failed to fetch stats"; // eslint-disable-line @typescript-eslint/no-explicit-any
            set({error: message});
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSong: async (id: string) => {
        set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: unknown) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
    },

    deleteAlbum: async (id: string) => {
        set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to delete album";
			toast.error("Failed to delete album: " + message);
		} finally {
			set({ isLoading: false });
		}
    },
}));