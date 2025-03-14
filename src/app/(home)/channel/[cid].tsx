import { useLocalSearchParams } from 'expo-router';
import { Channel as ChannelType } from "stream-chat";
import { Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Channel, Message, MessageInput, MessageList, useChatContext } from 'stream-chat-expo';

export default function ChatRoomScreen() {
    const [channel, setChannel] = useState<ChannelType | null>();
    const { cid } = useLocalSearchParams<{cid: string }>();
    const { client } = useChatContext();

    useEffect(() => {
        const fetchChannel = async () => {
        const channels = await client.queryChannels({ cid });
        console.log(channels);
        setChannel(channels[0]);
        }
        fetchChannel();
    }, [cid]);

    if (!channel) {
        return <ActivityIndicator />;
    }


return (
    <Channel channel={channel}>
        <MessageList />
        <MessageInput />
    </Channel>
    );
}