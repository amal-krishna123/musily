import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout =  () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <ResizablePanelGroup dir="vertical" className="flex-1 flex h-full overflow-hidden p-2">
                <AudioPlayer />
                {/* left sidebar */}
                <ResizablePanel defaultSize={40} minSize={150} maxSize={300} >
                    <LeftSidebar />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

                {/* main content area */}
                <ResizablePanel className="bg-black-500" defaultSize={isMobile ? 80 : 60}>
                    <Outlet />
                </ResizablePanel>

                {!isMobile && (
                    <>
                        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>
                        {/* right sidebar */}
                        <ResizablePanel defaultSize={40} minSize={150} maxSize={300} collapsedSize={0}>
                            <FriendsActivity/>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
            <PlaybackControls/>
        </div>
    );
};

export default MainLayout;