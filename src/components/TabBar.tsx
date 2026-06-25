import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    let insets = useSafeAreaInsets();
    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gradient}
            />
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    console.log(state.routes);
                    const { options } = descriptors[route.key];

                    const label =
                        options.tabBarLabel ?? options.title ?? route.name;

                    const isFocused = state.index === index;

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
                            <Text
                                style={[
                                    styles.text,
                                    isFocused && styles.activeText,
                                ]}
                            >
                                {label as string}
                            </Text>
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
        height: 80,
    },

    container: {
        flexDirection: "row",
        backgroundColor: Colors.surface,
        borderRadius: 999,
        padding: 6,
        marginHorizontal: 16,
        marginBottom: 25,
    },

    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderRadius: 999,
    },

    activeTab: {
        backgroundColor: Colors.primary,
    },

    text: {
        fontFamily: "DMSans-Medium",
        color: "#666",
    },

    activeText: {
        color: Colors.textInverse,
    },
});
