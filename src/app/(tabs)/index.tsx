import ArticleCard from "@/components/ArticleCard";
import Colors from "@/constants/Colors";
import { getFeaturedArticle, getRandomArticle } from "@/services/wikipedia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const [featuredArticle, setFeaturedArticle] = useState<any>(null);
    const [trendingArticles, setTrendingArticles] = useState<any>([]);
    const [onThisDayArticles, setOnThisDayArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getFeaturedArticle();

            setFeaturedArticle(data.tfa);
            setTrendingArticles(data.mostread?.articles || []);

            setOnThisDayArticles(data.onthisday || []);
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

    const textColor = featuredArticle?.thumbnail?.source
        ? Colors.textInverse
        : Colors.text;

    const secondaryTextColor = featuredArticle?.thumbnail?.source
        ? "rgba(255,255,255,0.9)"
        : Colors.textSecondary;

    const sections = [
        {
            title: "Trending",
            type: "trending",
            data: trendingArticles,
        },
        {
            title: "On This Day",
            type: "otd",
            data: onThisDayArticles,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <SectionList
                sections={sections}
                keyExtractor={(item, index) =>
                    typeof item === "string"
                        ? `${item}-${index}`
                        : `${item.title}-${index}`
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.logo}>WikiAtlas</Text>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.randomButton,
                                    pressed && styles.randomButtonPressed,
                                ]}
                                onPress={async () => {
                                    try {
                                        const randomArticle =
                                            await getRandomArticle();

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
                                <Text style={styles.randomButtonText}>
                                    Random
                                </Text>
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.featuredCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/article/[article]",
                                    params: {
                                        article: featuredArticle?.title,
                                    },
                                })
                            }
                        >
                            {featuredArticle?.thumbnail?.source && (
                                <>
                                    <Image
                                        source={
                                            featuredArticle.thumbnail.source
                                        }
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
                                        !featuredArticle?.thumbnail?.source && {
                                            backgroundColor:
                                                Colors.backgroundSecondary,
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
                                    {featuredArticle?.normalizedtitle ??
                                        featuredArticle?.title}
                                </Text>

                                {!!featuredArticle?.extract && (
                                    <Text
                                        style={[
                                            styles.featuredCardDescription,
                                            {
                                                color: secondaryTextColor,
                                            },
                                        ]}
                                    >
                                        {featuredArticle.description}
                                    </Text>
                                )}
                            </View>
                        </Pressable>
                    </>
                }
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                renderItem={({ item, section, index }) => {
                    if (section.type === "trending") {
                        return (
                            <ArticleCard
                                rank={index + 1}
                                title={item.titles.normalized}
                                subtitle={`${item.views.toLocaleString()} views`}
                                image={item.thumbnail?.source}
                                onPress={() =>
                                    router.push({
                                        pathname: "/article/[article]",
                                        params: {
                                            article: item.titles.normalized,
                                        },
                                    })
                                }
                            />
                        );
                    }

                    const article = item.pages?.[0];

                    if (!article) {
                        return null;
                    }

                    return (
                        <ArticleCard
                            title={article.normalizedtitle}
                            subtitle={item.text}
                            image={article.thumbnail?.source}
                            onPress={() =>
                                router.push({
                                    pathname: "/article/[article]",
                                    params: {
                                        article: article.normalizedtitle,
                                    },
                                })
                            }
                        />
                    );
                }}
            />
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
        paddingHorizontal: 16,
        paddingBottom: 16,
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
        transform: [{ scale: 0.95 }],
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
        backgroundColor: "rgba(255,255,255,0.2)",
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
        lineHeight: 36,
        fontFamily: "DMSans-Bold",
    },

    featuredCardDescription: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: "DMSans-Medium",
    },

    sectionTitle: {
        fontSize: 24,
        color: Colors.text,
        fontFamily: "DMSans-Bold",
        marginTop: 24,
        marginBottom: 12,
    },

    articleCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },

    articleRank: {
        width: 54,
        fontSize: 22,
        color: Colors.primary,
        fontFamily: "DMSans-Bold",
    },

    articleTitle: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        fontFamily: "DMSans-SemiBold",
    },

    articleMeta: {
        marginTop: 4,
        fontSize: 13,
        color: Colors.textSecondary,
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
