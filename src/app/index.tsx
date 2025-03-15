import { Text, View } from "react-native";
import { Redirect, Href } from "expo-router";

export default function ToTab() {
  const linkToTab = '/(auth)/login' as Href;
  return <Redirect href = {linkToTab} />;
}
