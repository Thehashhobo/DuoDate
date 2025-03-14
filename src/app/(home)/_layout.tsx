import ChatProvider from "@/src/providers/ChatProvider";
import { Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";



export default function HomeLayout() {
  
    return(
        <ChatProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                </Stack>
        </ChatProvider>
      ); 
}