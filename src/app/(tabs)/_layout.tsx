import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";

export default function RootLayout() {
    return (
        <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                headerTransparent: true,
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
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                }}
            />

            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                }}
            />
        </Tabs>
    );
}
