import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.wrapper,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={[
                    styles.gradient,
                    {
                        height: insets.bottom + 80,
                    },
                ]}
            />

            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const icon =
                        typeof options.tabBarIcon === "function"
                            ? options.tabBarIcon({
                                  focused: isFocused,
                                  color: isFocused
                                      ? Colors.textInverse
                                      : "#666",
                                  size: 24,
                              })
                            : null;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={[styles.tab, isFocused && styles.activeTab]}
                        >
                            {icon}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },

    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },

    container: {
        flexDirection: "row",
        backgroundColor: Colors.surface,
        borderRadius: 999,
        padding: 4,
        marginHorizontal: 32,
        marginBottom: 16,
    },

    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 999,
    },

    activeTab: {
        backgroundColor: Colors.primary,
    },
});
