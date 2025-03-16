import { Stack } from "expo-router";
// import AuthProvider  from "../../../providers/AuthProvider";

export default function OnboardingLayout() {
  return (
    // <AuthProvider>
      <Stack>
        <Stack.Screen name="ageVerification" options={{ title: "Verify Age" }} />
        <Stack.Screen name="infoCards" options={{ title: "Welcome" }} />
      </Stack>
    // </AuthProvider>
  );
}
