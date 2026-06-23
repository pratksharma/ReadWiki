import Header from "@/components/Header";
import { Tabs } from "expo-router";
import RemixIcon from "react-native-remix-icon";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerTransparent: true,
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#8d8d8d",
                header: ({ options }) => (
                    <Header
                        title={options.title ?? ""}
                        rightComponent={
                            options.headerRight?.({
                                tintColor: "#fff",
                                canGoBack: false,
                            }) ?? null
                        }
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "WikiAtlas",
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused, color, size }) => (
                        <RemixIcon
                            name={focused ? "home-5-fill" : "home-5-line"}
                            size={size}
                            color={color as string}
                            fallback={null}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ focused, color, size }) => (
                        <RemixIcon
                            name={focused ? "search-fill" : "search-line"}
                            size={size}
                            color={color as string}
                            fallback={null}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ focused, color, size }) => (
                        <RemixIcon
                            name={
                                focused ? "settings-3-fill" : "settings-3-line"
                            }
                            size={size}
                            color={color as string}
                            fallback={null}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
