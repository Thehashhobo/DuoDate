import { Text, View } from "react-native";
import { Redirect, Href } from "expo-router";

export default function ToTab() {
  const linkToTab = '/(home)/(tabs)/discoveryScreen' as Href;
  return <Redirect href = {linkToTab} />;
}
