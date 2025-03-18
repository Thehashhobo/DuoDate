import { Stack } from "expo-router";
import { OnboardingProvider } from "../../providers/OnboardingProvider";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack/ >
    </OnboardingProvider>

  );
}
