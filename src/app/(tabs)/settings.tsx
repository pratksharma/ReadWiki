import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

const Settings = () => {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.item}
                onPress={() => router.push("/about")}
            >
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <RemixIcon
                            name="information-line"
                            size={22}
                            color={Colors.primary}
                        />
                    </View>

                    <View>
                        <Text style={styles.title}>About</Text>
                        <Text style={styles.subtitle}>
                            Learn more about WikiAtlas
                        </Text>
                    </View>
                </View>

                <RemixIcon
                    name="arrow-right-s-line"
                    size={22}
                    color={Colors.textSecondary}
                />
            </Pressable>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 120,
        backgroundColor: Colors.background,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.surface,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surface,
        marginRight: 14,
    },
    title: {
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
        color: Colors.text,
    },
    subtitle: {
        marginTop: 2,
        fontSize: 13,
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
    },
});
