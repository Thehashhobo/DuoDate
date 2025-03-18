import { useRouter, Href } from "expo-router";
import { View, Text, Button, FlatList, Dimensions } from "react-native";
import { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";


const infoData = [
  { id: "1", text: "Welcome to the App! Connect with people who share your hobbies." },
  { id: "2", text: "Swipe through interesting profiles and make new friends!" },
  { id: "3", text: "Join groups and events based on your interests!" },
];

export default function InfoCards() {
  const router = useRouter();
  const { user, fetchProfile } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get("window").width;

  const handleNext = async () => {
    if (currentIndex < infoData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      if (!user) return; // Ensure user is logged in before updating

      // Mark onboarding as complete in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding: true })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating onboarding status:", error.message);
        return;
      }
      await fetchProfile(); // Refresh the profile data
      // Navigate to the main content
      const mainContent = "/(home)/(tabs)/discoveryScreen" as Href;
      router.replace(mainContent);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={infoData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: screenWidth, padding: 20 }}>
            <Text style={{ fontSize: 20, textAlign: "center" }}>{item.text}</Text>
          </View>
        )}
      />
      <Button title={currentIndex < infoData.length - 1 ? "Next" : "Get Started"} onPress={handleNext} />
    </View>
  );
}
