import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
    title: string;
    canGoBack?: boolean;
    rightComponent?: ReactNode;
}

const Header = ({ title, canGoBack = false, rightComponent }: HeaderProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                paddingTop: insets.top,
            }}
        >
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={["rgba(0,0,0,0.7)", "transparent"]}
                style={[
                    styles.gradient,
                    {
                        height: insets.top + 84,
                    },
                ]}
            />

            <View style={styles.headerContent}>
                <View style={styles.leftContainer}>
                    {canGoBack && (
                        <Pressable
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <RemixIcon
                                name="arrow-left-line"
                                size={24}
                                color={Colors.textInverse}
                                fallback={null}
                            />
                        </Pressable>
                    )}

                    <Text style={styles.logo}>{title}</Text>
                </View>

                <View style={styles.rightContainer}>{rightComponent}</View>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        // height: 120,
    },

    headerContent: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        zIndex: 1001,
    },

    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },

    backButton: {
        padding: 4,
    },

    logo: {
        fontSize: 32,
        color: Colors.textInverse,
        fontFamily: "BricolageGrotesque-SemiBold",
        letterSpacing: -1,
    },

    rightContainer: {
        minWidth: 40,
        alignItems: "flex-end",
        justifyContent: "center",
    },
});
