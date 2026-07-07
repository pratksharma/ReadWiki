import { useScreenScroll } from "@/components/HeaderScroll";
import Colors from "@/constants/Colors";
import {
    FONT_SCALES,
    setPreference,
    usePreferences,
} from "@/services/preferences";
import { clearSavedArticles, useSavedArticles } from "@/services/savedArticles";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import RemixIcon from "react-native-remix-icon";

const Settings = () => {
    const preferences = usePreferences();
    const savedArticles = useSavedArticles();
    const onScroll = useScreenScroll();

    const confirmClearSaved = () => {
        if (savedArticles.length === 0) {
            return;
        }

        Alert.alert(
            "Clear saved articles",
            `Remove all ${savedArticles.length} saved article(s)? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: clearSavedArticles,
                },
            ],
        );
    };

    return (
        <Animated.ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
        >
            {/* Reading text size */}
            <Text style={styles.sectionTitle}>Reading</Text>

            <View style={styles.card}>
                <Text style={styles.rowLabel}>Text size</Text>
                <Text style={styles.rowHint}>
                    Adjust how large article text appears.
                </Text>

                <View style={styles.chips}>
                    {FONT_SCALES.map((option) => {
                        const active = preferences.fontScale === option.value;

                        return (
                            <Pressable
                                key={option.label}
                                style={[
                                    styles.chip,
                                    active && styles.chipActive,
                                ]}
                                onPress={() =>
                                    setPreference("fontScale", option.value)
                                }
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        active && styles.chipTextActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Library */}
            <Text style={styles.sectionTitle}>Library</Text>

            <Pressable style={styles.item} onPress={confirmClearSaved}>
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <RemixIcon
                            name="delete-bin-line"
                            size={22}
                            color={Colors.accent}
                            fallback={null}
                        />
                    </View>

                    <View style={styles.itemTextWrap}>
                        <Text style={styles.title}>Clear saved articles</Text>
                        <Text style={styles.subtitle}>
                            {savedArticles.length} saved
                        </Text>
                    </View>
                </View>

                <RemixIcon
                    name="arrow-right-s-line"
                    size={22}
                    color={Colors.textSecondary}
                    fallback={null}
                />
            </Pressable>

            {/* General */}
            <Text style={styles.sectionTitle}>General</Text>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/onboarding")}
            >
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <RemixIcon
                            name="compass-3-line"
                            size={22}
                            color={Colors.accent}
                            fallback={null}
                        />
                    </View>

                    <View style={styles.itemTextWrap}>
                        <Text style={styles.title}>Getting started</Text>
                        <Text style={styles.subtitle}>
                            Replay the welcome tour
                        </Text>
                    </View>
                </View>

                <RemixIcon
                    name="arrow-right-s-line"
                    size={22}
                    color={Colors.textSecondary}
                    fallback={null}
                />
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/about")}
            >
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <RemixIcon
                            name="information-line"
                            size={22}
                            color={Colors.accent}
                            fallback={null}
                        />
                    </View>

                    <View style={styles.itemTextWrap}>
                        <Text style={styles.title}>About</Text>
                        <Text style={styles.subtitle}>
                            Learn more about ReadWiki
                        </Text>
                    </View>
                </View>

                <RemixIcon
                    name="arrow-right-s-line"
                    size={22}
                    color={Colors.textSecondary}
                    fallback={null}
                />
            </Pressable>
        </Animated.ScrollView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
        paddingTop: 120,
        paddingBottom: 32,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: "DMSans-SemiBold",
        color: Colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginTop: 8,
        marginLeft: 4,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.surface,
    },
    rowLabel: {
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
        color: Colors.text,
    },
    rowHint: {
        marginTop: 2,
        fontSize: 13,
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 14,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: Colors.backgroundMuted,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        color: Colors.text,
    },
    chipTextActive: {
        color: Colors.textInverse,
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
        flex: 1,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.backgroundMuted,
        marginRight: 14,
    },
    itemTextWrap: {
        flex: 1,
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
