import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { FontAwesome6, AntDesign, Ionicons, Feather } from '@expo/vector-icons';

export default function TabNavigator() {
    return(
    <Tabs>
        <Tabs.Screen 
        name="discoveryScreen" 
        options={{
            title: "Discovery", 
            tabBarIcon: ({size, color}) => (
                <FontAwesome6 name="star" size={size} color={color} />
            ),
        }}
        />    
        <Tabs.Screen 
        name="duoScreen" 
        options={{
            title: "Duo", 
            tabBarIcon: ({size, color}) => (
                <AntDesign name="team" size={size} color={color} />
            ),
        }}
        />
        <Tabs.Screen 
        name="likedScreen" 
        options={{
            title: "Likes", 
            tabBarIcon: ({size, color}) => (
                <Feather name="heart" size={size} color={color} />
            ),
        }}
        /> 
        <Tabs.Screen 
        name="chatScreen" 
        options={{
            title: "Chat", 
            tabBarIcon: ({size, color}) => (
                <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
            ),
        }}
        />

        <Tabs.Screen 
        name="profileScreen" 
        options={{
            title: "Profile", 
            tabBarIcon: ({size, color}) => (
                <AntDesign name="profile" size={size} color={color} />
            ),
        }}
        />         
        
    </Tabs>
    );
}