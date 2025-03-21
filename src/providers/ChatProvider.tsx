
import { PropsWithChildren, useState} from "react";
import { StreamChat } from "stream-chat";
import { Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { ActivityIndicator } from "react-native";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_KEY as string)

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { profile, photos, fetchProfilePhoto, fetchProfile } = useAuth();

    useEffect(() => {
      if (!profile) {return;}
        const connect = async () => {
            fetchProfile();
            fetchProfilePhoto();
            const publicUrl = supabase.storage.from("photos").getPublicUrl(photos?.[0] ?? "");
            console.log("publicUrl in chat provider is: ", publicUrl.data.publicUrl);
            await client.connectUser(
                {
                  id: profile.id as string,
                  name: profile.name as string, // need to implement name input first 
                  image: publicUrl.data.publicUrl, // pulicUrl not update
                },
                client.devToken(profile.id as string),
              );
              setIsReady(true);

        // const channel = client.channel("messaging", "the_park", {
        //     name: "The Park",
        // });
        // await channel.watch();
      };
      connect();
      return () => {
        if (isReady){
          client.disconnectUser();
        }
        setIsReady(false);
      }
    }, [profile?.id]); 

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <>
     <OverlayProvider>
        <Chat client={client}>
        {children}    
        </Chat>
     </OverlayProvider>
      
    </>
  );
}