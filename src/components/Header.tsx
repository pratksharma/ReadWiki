import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
    title: string;
    button?: ReactNode;
}

const Header = ({ title, button }: HeaderProps) => {
    const inset = useSafeAreaInsets();
    return (
        <View
            style={[
                styles.header,
                {
                    paddingTop: inset.top,
                },
            ]}
        >
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={["rgba(0, 0, 0, 0.7)", "transparent"]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    width: "100%",
                    height: 100,
                }}
            />
            <View style={styles.headerContent}>
                <Text style={styles.logo}>{title}</Text>
                {button}
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },

    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1001,
        paddingHorizontal: 16,
    },

    logo: {
        fontSize: 32,
        color: Colors.textInverse,
        fontFamily: "BricolageGrotesque-SemiBold",
        letterSpacing: -1,
    },
});
