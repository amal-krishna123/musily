import Topbar from "@/components/Topbar"
import { useMusicStore } from "@/stores/useMusicStores"
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStores";

const HomePage = () => {

    const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, isLoading, featuredSongs, madeForYouSongs, trendingSongs } = useMusicStore();

    const {initializeQueue} = usePlayerStore();

    useEffect(() => {
        fetchFeaturedSongs();
        fetchMadeForYouSongs();
        fetchTrendingSongs();
    }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

    useEffect(() => {
        if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0){
            const allSongs = [...featuredSongs,...madeForYouSongs,...trendingSongs];
            initializeQueue(allSongs);
        }
    },[initializeQueue, featuredSongs, madeForYouSongs, trendingSongs]);

    return <main className=" rounded-md overflow-hidden h-full bg-linear-to-b from-zinc-800 to-zinc-900">
        <Topbar/>
        <ScrollArea className=" h-[calc(100vh-180px)]">
            <div className=" p-4 sm:p-6">
            <h1 className=" text-2xl sm:text-3xl font-bold mb-6">heyya there ;)</h1>
            <FeaturedSection/>

            <div className=" space-y-8">
                <SectionGrid title="Made 4 yo!" songs={madeForYouSongs} isLoading= {isLoading}></SectionGrid>
                <SectionGrid title="Trendy songs" songs ={trendingSongs} isLoading= {isLoading}></SectionGrid>
            </div>
            </div>
        </ScrollArea>
    </main>
}

export default HomePage