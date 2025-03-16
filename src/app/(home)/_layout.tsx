import ChatProvider from "@/src/providers/ChatProvider";
import { Slot, Stack, Redirect, Href, useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";

export default function HomeLayout() {
    const router = useRouter();
    const { user, onboardingComplete } = useAuth();
    if (!user) {
        const linkToHome = "/(auth)/login" as Href;
        return <Redirect href={linkToHome} />;
    } 

    useEffect(() => {
        if (onboardingComplete === false) {
            console.log(onboardingComplete);
            const linkToonboard = "/(onboarding)/" as Href;
            router.replace(linkToonboard); // ✅ Now runs ONCE inside `useEffect`
        }
    }, [onboardingComplete]); 
  
    return(
        <ChatProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                </Stack>
        </ChatProvider>
      ); 
}