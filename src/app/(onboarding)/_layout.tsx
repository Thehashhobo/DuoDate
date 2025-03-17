import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
      <Stack>
        <Stack.Screen name="ageVerification" options={{ title: "Verify Age" }} />
        <Stack.Screen name="infoCards" options={{ title: "Welcome" }} />
      </Stack>
  );
}
