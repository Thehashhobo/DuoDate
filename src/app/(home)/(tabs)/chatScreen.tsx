import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.placeholderText}>This is the Chat Screen</Text>
        </View>
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