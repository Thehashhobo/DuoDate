import { Stack, Redirect, Href } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

export default function AuthLayout() {
    const { user } = useAuth();

    if (user) {
        const linkToHome = "/(home)/(tabs)/discoveryScreen" as Href;
        return <Redirect href={linkToHome} />;
    }
return (
    <Stack />
);
}