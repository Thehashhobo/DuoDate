import { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useRouter, Href } from "expo-router";

export default function AgeVerification() {
  const [isEligible, setIsEligible] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (isEligible) {
      const infoCards = "/(onboarding)/infoCards" as Href;
      router.push(infoCards); // Go to next step
    } else {
      Alert.alert("Age Restriction", "You must be 18 or older to continue.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Are you 18 or older?</Text>
      <Button title="Yes, I'm 18+" onPress={() => setIsEligible(true)} />
      <Button title="Next" onPress={handleNext} disabled={!isEligible} />
    </View>
  );
}
