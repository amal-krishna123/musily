import { usePlayerStore } from "@/stores/usePlayerStores";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const {currentSong, isPlaying, playNext} = usePlayerStore();
    const { user } = useUser();

    //play pause
    useEffect(() =>{
        if(isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    },[isPlaying]);

    //song ends
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => {
            playNext(user?.id);
        }
        audio?.addEventListener("ended",handleEnded);

        return () => audio?.removeEventListener("ended",handleEnded);
    },[ playNext, user?.id]);

    //song changing
    useEffect(() => {
        if(!audioRef.current || !currentSong) return;
        const audio = audioRef.current;
        //check if new song
        const isSongChange = prevSongRef.current !== currentSong?.songURL;
        if(isSongChange){
            audio.src = currentSong?.songURL;
            //reset playback position
            audio.currentTime=0;
            prevSongRef.current = currentSong?.songURL;
            if(isPlaying) audio.play();
        }
    },[isPlaying, currentSong]);

    return (
        <audio ref={audioRef}/>
    )
}

export default AudioPlayer;