import { Redirect, Href } from "expo-router";

export default function OnboardingIndex() {
    
const linkToOnboard = "/(onboarding)/ageVerification" as Href;
  return <Redirect href={linkToOnboard}/>;
}