import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStores";
import { useChatStore } from "@/stores/useChatStores";

const updateApiToken = (token: string | null) => {
    if(token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProviders = ({ children }: { children: React.ReactNode }) => {

    const { getToken, userId } = useAuth();
    const [ loading, setLoading ] = useState(true);
    const { checkAdminStatus } = useAuthStore();
    const { initSocket, disconnectSocket} = useChatStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);
                if(token) {
                    await checkAdminStatus();
                    //init socket
                    if(userId) initSocket(userId);
                }
            } catch (error: unknown) {
                updateApiToken(null);
                console.log("Error getting token:", error);
            }  finally {
                setLoading(false);
            }
        };

        initAuth();

        // clean up
        return () => disconnectSocket();
    }, [ getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

    if(loading) return (
        <div className="h-screen flex justify-center items-center w-full"> 
            <Loader className="size-10 text-emerald-500 animate-spin" />
        </div>

    );

    return <>{children}</>;
};

export default AuthProviders;