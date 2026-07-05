import Colors from "@/constants/Colors";
import { completeOnboarding } from "@/services/preferences";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// The welcome slides shown on first launch (and replayable from Settings).
const SLIDES = [
    {
        icon: "compass-3-line",
        title: "Welcome to WikiAtlas",
        description:
            "A clean, modern way to explore Wikipedia — featured articles, the image of the day and more, all in one place.",
    },
    {
        icon: "flashlight-line",
        title: "Get in the Flow",
        description:
            "Swipe through an endless feed of random articles, just like your favourite short-video apps — but for knowledge.",
    },
    {
        icon: "bookmark-line",
        title: "Save for later",
        description:
            "Tap the bookmark while reading to keep any article in your Saved tab and come back to it anytime.",
    },
    {
        icon: "book-open-line",
        title: "Read beautifully",
        description:
            "Articles are formatted for easy reading with working links and images. Adjust the text size in Settings.",
    },
];

const Onboarding = () => {
    const insets = useSafeAreaInsets();
    const listRef = useRef<FlatList>(null);
    const [index, setIndex] = useState(0);

    const isLast = index === SLIDES.length - 1;

    const finish = () => {
        completeOnboarding();

        // If we got here from Settings, just go back; otherwise enter the app.
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(tabs)");
        }
    };

    const next = () => {
        if (isLast) {
            finish();
        } else {
            listRef.current?.scrollToIndex({ index: index + 1 });
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            {/* Skip */}
            <View style={styles.topBar}>
                {!isLast && (
                    <Pressable onPress={finish} hitSlop={12}>
                        <Text style={styles.skip}>Skip</Text>
                    </Pressable>
                )}
            </View>

            <FlatList
                ref={listRef}
                data={SLIDES}
                keyExtractor={(item) => item.title}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) =>
                    setIndex(
                        Math.round(
                            event.nativeEvent.contentOffset.x / width,
                        ),
                    )
                }
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.iconCircle}>
                            <RemixIcon
                                name={item.icon}
                                size={56}
                                color={Colors.primary}
                                fallback={null}
                            />
                        </View>

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                    </View>
                )}
            />

            <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
                {/* Dots */}
                <View style={styles.dots}>
                    {SLIDES.map((_, dotIndex) => (
                        <View
                            key={dotIndex}
                            style={[
                                styles.dot,
                                dotIndex === index && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={next}
                >
                    <Text style={styles.buttonText}>
                        {isLast ? "Get Started" : "Next"}
                    </Text>
                    <RemixIcon
                        name="arrow-right-long-fill"
                        size={18}
                        color={Colors.textInverse}
                        fallback={null}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    topBar: {
        height: 44,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
    },
    skip: {
        fontSize: 15,
        fontFamily: "DMSans-SemiBold",
        color: Colors.textSecondary,
    },
    slide: {
        width,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Colors.surface,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 30,
        lineHeight: 36,
        textAlign: "center",
        fontFamily: "Fraunces-SemiBold",
        color: Colors.text,
    },
    description: {
        marginTop: 16,
        fontSize: 16,
        lineHeight: 26,
        textAlign: "center",
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
    },
    footer: {
        paddingHorizontal: 24,
        gap: 24,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.border,
    },
    dotActive: {
        width: 22,
        backgroundColor: Colors.primary,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 999,
    },
    buttonPressed: {
        filter: "brightness(0.9)",
        transform: [{ scale: 0.99 }],
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
        color: Colors.textInverse,
    },
});
