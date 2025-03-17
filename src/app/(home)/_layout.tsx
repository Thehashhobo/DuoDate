import ChatProvider from "@/src/providers/ChatProvider";
import { Slot, Stack, Redirect, Href, useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";

export default function HomeLayout() {
    const router = useRouter();
    const { user, profile } = useAuth();
    if (!user) {
        const linkToHome = "/(auth)/login" as Href;
        return <Redirect href={linkToHome} />;
    } 

    useEffect(() => {

        if (!profile) {
            return;
        }
        console.log("profile in layout is: ", profile);
        console.log("profile onboarding in layout is: ", profile.onboarding);
        if (profile.onboarding === false ) {
            const linkToonboard = "/(onboarding)/" as Href;
            router.replace(linkToonboard); // ✅ Now runs ONCE inside `useEffect`
        }
    }, [profile?.id]); 
  
    return(
        <ChatProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                </Stack>
        </ChatProvider>
      ); 
}