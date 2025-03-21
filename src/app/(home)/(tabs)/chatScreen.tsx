import { router, RelativePathString} from 'expo-router';
import {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Channel as ChannelType } from "stream-chat";
import { ChannelList } from 'stream-chat-expo';
import { useAuth } from '../../../providers/AuthProvider';

const ChatScreen = () => {
    const [channel, setChannel] = useState<ChannelType|null>();
    const {user} = useAuth();
    return (
        
        <ChannelList 
            filters={{members: { $in: user?.id ? [user.id] : [] }}}
            onSelect={(channel) => router.push(`/channel/${channel?.cid}`)}/>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    placeholderText: {
        fontSize: 18,
        color: '#333',
    },
});

export default ChatScreen;