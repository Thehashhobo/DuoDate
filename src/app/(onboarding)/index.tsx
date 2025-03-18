import { Redirect, Href } from "expo-router";

export default function OnboardingIndex() {
    
const linkToOnboard = "/(onboarding)/ageScreen" as Href;
  return <Redirect href={linkToOnboard}/>;
}