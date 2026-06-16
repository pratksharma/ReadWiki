import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "DMSans-Regular": require("../../assets/fonts/DMSans-Regular.ttf"),
        "DMSans-Medium": require("../../assets/fonts/DMSans-Medium.ttf"),
        "DMSans-SemiBold": require("../../assets/fonts/DMSans-SemiBold.ttf"),
        "DMSans-Bold": require("../../assets/fonts/DMSans-Bold.ttf"),
        // "BricolageGrotesque-ExtraLight": require("../../assets/fonts/BricolageGrotesque-ExtraLight.ttf"),
        // "BricolageGrotesque-Light": require("../../assets/fonts/BricolageGrotesque-Light.ttf"),
        // "BricolageGrotesque-Regular": require("../../assets/fonts/BricolageGrotesque-Regular.ttf"),
        // "BricolageGrotesque-Medium": require("../../assets/fonts/BricolageGrotesque-Medium.ttf"),
        // "BricolageGrotesque-Bold": require("../../assets/fonts/BricolageGrotesque-Bold.ttf"),
        "BricolageGrotesque-SemiBold": require("../../assets/fonts/BricolageGrotesque-SemiBold.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                header: ({ options, navigation }) => (
                    <Header
                        title={options.title ?? ""}
                        canGoBack={navigation.canGoBack()}
                        rightComponent={
                            options.headerRight?.({
                                tintColor: "#fff",
                                canGoBack: navigation.canGoBack(),
                            }) ?? null
                        }
                    />
                ),
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="article/[article]"
                options={{ title: "Article" }}
            />
            {/* <Stack.Screen name="image/[image]" options={{ title: "Image" }} /> */}
            <Stack.Screen name="trending" options={{ title: "Trending" }} />
            <Stack.Screen
                name="on-this-day"
                options={{ title: "On This Day" }}
            />
        </Stack>
    );
}
