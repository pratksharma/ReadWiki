import Colors from "@/constants/Colors";
import { getFeaturedArticle, getRandomArticle } from "@/services/wikipedia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const [featuredArticle, setFeaturedArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedArticle();
    }, []);

    const loadFeaturedArticle = async () => {
        try {
            const data = await getFeaturedArticle();
            setFeaturedArticle(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>
                    Loading today's article...
                </Text>
            </View>
        );
    }

    const article = featuredArticle?.tfa;

    const textColor = article?.thumbnail?.source
        ? Colors.textInverse
        : Colors.text;

    const secondaryTextColor = article?.thumbnail?.source
        ? "rgba(255,255,255,0.90)"
        : Colors.textSecondary;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>WikiAtlas</Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.randomButton,
                            pressed && styles.randomButtonPressed,
                        ]}
                        onPress={async () => {
                            try {
                                const randomArticle = await getRandomArticle();

                                router.push({
                                    pathname: "/article/[article]",
                                    params: {
                                        article: randomArticle,
                                    },
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <RemixIcon
                            name="shuffle-line"
                            size={16}
                            color={Colors.text}
                            fallback={null}
                        />
                        <Text style={styles.randomButtonText}>Random</Text>
                    </Pressable>
                </View>

                <Pressable
                    style={styles.featuredCard}
                    onPress={() =>
                        router.push({
                            pathname: "/article/[article]",
                            params: {
                                article: article?.title,
                            },
                        })
                    }
                >
                    {article?.thumbnail?.source && (
                        <>
                            <Image
                                source={article.thumbnail.source}
                                style={styles.featuredCardImage}
                                contentFit="cover"
                            />
                            <View style={styles.featuredCardOverlay} />
                        </>
                    )}

                    <View style={styles.featuredCardContent}>
                        <View
                            style={[
                                styles.featuredCardBadge,
                                !article?.thumbnail?.source && {
                                    backgroundColor: Colors.backgroundSecondary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.featuredCardBadgeText,
                                    {
                                        color: textColor,
                                    },
                                ]}
                            >
                                FEATURED ARTICLE
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.featuredCardTitle,
                                {
                                    color: textColor,
                                },
                            ]}
                            numberOfLines={4}
                        >
                            {article?.normalizedtitle ?? article?.title}
                        </Text>

                        {!!article?.extract && (
                            <Text
                                style={[
                                    styles.featuredCardDescription,
                                    {
                                        color: secondaryTextColor,
                                    },
                                ]}
                            >
                                {article.description}
                            </Text>
                        )}

                        {/* <View
                            style={[
                                styles.featuredCardButton,
                                !article?.thumbnail?.source && {
                                    backgroundColor: Colors.primary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.featuredCardButtonText,
                                    {
                                        color: article?.thumbnail?.source
                                            ? Colors.text
                                            : Colors.textInverse,
                                    },
                                ]}
                            >
                                Read Article
                            </Text>
                        </View> */}
                    </View>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
    },

    loadingText: {
        marginTop: 12,
        color: Colors.textSecondary,
        fontSize: 14,
        fontFamily: "DMSans-Medium",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },

    randomButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: Colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    randomButtonPressed: {
        backgroundColor: Colors.surfaceHover,
        transform: "scale(0.95)",
    },

    randomButtonText: {
        fontFamily: "DMSans-SemiBold",
        fontSize: 14,
        color: Colors.text,
    },

    logo: {
        fontSize: 32,
        color: Colors.text,
        fontFamily: "DMSans-Bold",
        letterSpacing: -1,
    },

    featuredCard: {
        height: 400,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        position: "relative",
    },

    featuredCardImage: {
        ...StyleSheet.absoluteFill,
    },

    featuredCardOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.55)",
    },

    featuredCardContent: {
        flex: 1,
        justifyContent: "flex-end",
        gap: 12,
        padding: 24,
    },

    featuredCardBadge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.20)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    featuredCardBadgeText: {
        fontSize: 12,
        letterSpacing: 1,
        fontFamily: "DMSans-Bold",
    },

    featuredCardTitle: {
        fontSize: 32,
        lineHeight: 32,
        fontFamily: "DMSans-Bold",
    },

    featuredCardDescription: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: "DMSans-Medium",
    },

    featuredCardButton: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 999,
    },

    featuredCardButtonText: {
        fontSize: 16,
        fontFamily: "DMSans-Bold",
    },
});
