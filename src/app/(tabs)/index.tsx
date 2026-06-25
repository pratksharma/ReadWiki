import ArticleCard from "@/components/ArticleCard";
import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/Colors";
import { getFeaturedArticle, getRandomArticle } from "@/services/wikipedia";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const Home = () => {
    const [featuredArticle, setFeaturedArticle] = useState<any>(null);
    const [trendingArticles, setTrendingArticles] = useState<any>([]);
    const [imageOfTheDay, setImageOfTheDay] = useState<any>([]);
    const [onThisDayArticles, setOnThisDayArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getFeaturedArticle();

            setFeaturedArticle(data.tfa);
            setTrendingArticles(data.mostread?.articles.slice(0, 3) || []);
            setImageOfTheDay(data.image);
            setOnThisDayArticles(data.onthisday.slice(0, 3) || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            slug: "trending",
            data: trendingArticles,
        },
        {
            title: "On This Day",
            type: "otd",
            slug: "on-this-day",
            data: onThisDayArticles,
        },
    ];

    return (
        <View style={styles.container}>
            <Tabs.Screen
                options={{
                    headerRight: () => (
                        <PrimaryButton
                            text="Random"
                            iconName="shuffle-line"
                            iconPosition="left"
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
                        />
                    ),
                }}
            />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>
                        Loading today's article...
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.sectionContainer}>
                    <View style={styles.featuredCard}>
                        {featuredArticle?.thumbnail?.source && (
                            <>
                                <Image
                                    source={featuredArticle.thumbnail.source}
                                    style={styles.featuredCardImage}
                                    contentFit="cover"
                                />
                                <View style={styles.featuredCardOverlay} />

                                <LinearGradient
                                    colors={[
                                        "transparent",
                                        "rgba(0, 0, 0, 0.7)",
                                    ]}
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
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
                                    Featured Article
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.featuredCardTitle,
                                    {
                                        color: textColor,
                                    },
                                ]}
                                numberOfLines={2}
                            >
                                {featuredArticle?.normalizedtitle ??
                                    featuredArticle?.titles.normalized}
                            </Text>

                            {!!featuredArticle?.extract && (
                                <Text
                                    style={[
                                        styles.featuredCardDescription,
                                        {
                                            color: secondaryTextColor,
                                        },
                                    ]}
                                    numberOfLines={4}
                                >
                                    {featuredArticle.extract == ""
                                        ? featuredArticle.description
                                        : featuredArticle.extract}
                                </Text>
                            )}
                            <View style={{ alignItems: "flex-start" }}>
                                <PrimaryButton
                                    text="Read More"
                                    iconName="arrow-right-long-fill"
                                    theme={
                                        featuredArticle?.thumbnail
                                            ? "light"
                                            : "dark"
                                    }
                                    onPress={() =>
                                        router.push({
                                            pathname: "/article/[article]",
                                            params: {
                                                article: featuredArticle?.title,
                                            },
                                        })
                                    }
                                />
                            </View>
                        </View>
                    </View>
                    {imageOfTheDay && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Image of the Day
                            </Text>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.imageCard,
                                    {
                                        marginHorizontal: 16,
                                    },
                                    pressed && styles.imageCardPressed,
                                ]}
                                onPress={() => {
                                    router.navigate({
                                        pathname: "/image/[image]",
                                        params: {
                                            image: imageOfTheDay.thumbnail
                                                .source,
                                        },
                                    });
                                }}
                            >
                                <Image
                                    source={imageOfTheDay.thumbnail?.source}
                                    style={styles.imageCardImage}
                                    contentFit="cover"
                                />

                                <View style={styles.imageCardContent}>
                                    <Text style={styles.imageCardTitle}>
                                        Author: {imageOfTheDay.artist.text}
                                    </Text>

                                    {!!imageOfTheDay.description?.text && (
                                        <Text
                                            style={styles.imageCardDescription}
                                        >
                                            {imageOfTheDay.description.text}
                                        </Text>
                                    )}
                                </View>
                            </Pressable>
                        </View>
                    )}
                    {trendingArticles && (
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    Trending
                                </Text>
                            </View>
                            <View style={styles.sectionContent}>
                                <FlatList
                                    data={trendingArticles}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) =>
                                        item.titles.normalized + index
                                    }
                                    contentContainerStyle={styles.trendingList}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            onPress={() =>
                                                router.push({
                                                    pathname:
                                                        "/article/[article]",
                                                    params: {
                                                        article:
                                                            item.titles
                                                                .normalized,
                                                    },
                                                })
                                            }
                                            style={styles.trendingCard}
                                        >
                                            {item.thumbnail && (
                                                <Image
                                                    source={
                                                        item.thumbnail.source
                                                    }
                                                    contentFit="cover"
                                                    style={styles.trendingImage}
                                                />
                                            )}

                                            <LinearGradient
                                                colors={[
                                                    "transparent",
                                                    "rgba(0,0,0,0.7)",
                                                ]}
                                                style={styles.trendingGradient}
                                            />

                                            <View
                                                style={styles.trendingContent}
                                            >
                                                <Text
                                                    style={styles.trendingTitle}
                                                    numberOfLines={2}
                                                >
                                                    {item.titles.normalized}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.trendingDescription
                                                    }
                                                    numberOfLines={3}
                                                >
                                                    {item.extract}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    )}
                                />
                            </View>

                            <View
                                style={{
                                    alignItems: "center",
                                    marginTop: 10,
                                }}
                            >
                                <PrimaryButton
                                    text={`More Trending Articles`}
                                    iconName="arrow-right-long-fill"
                                    iconPosition="right"
                                    theme="dark"
                                    onPress={() => router.navigate("/trending")}
                                />
                            </View>
                        </View>
                    )}
                    {onThisDayArticles && (
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    On This Day
                                </Text>
                            </View>
                            <View style={styles.sectionContent}>
                                {onThisDayArticles.map(
                                    (item: any, index: number) => {
                                        const article = item.pages?.[0];

                                        if (!article) {
                                            return null;
                                        }
                                        return (
                                            <ArticleCard
                                                key={
                                                    article.normalizedtitle +
                                                    index
                                                }
                                                title={article.normalizedtitle}
                                                subtitle={item.text}
                                                tag={item.year}
                                                image={
                                                    article.thumbnail?.source
                                                }
                                                onPress={() =>
                                                    router.push({
                                                        pathname:
                                                            "/article/[article]",
                                                        params: {
                                                            article:
                                                                article.normalizedtitle,
                                                        },
                                                    })
                                                }
                                            />
                                        );
                                    },
                                )}
                            </View>

                            <View
                                style={{
                                    alignItems: "center",
                                    marginTop: 10,
                                }}
                            >
                                <PrimaryButton
                                    text={`More On This Day Articles`}
                                    iconName="arrow-right-long-fill"
                                    iconPosition="right"
                                    theme="dark"
                                    onPress={() =>
                                        router.navigate("/on-this-day")
                                    }
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        gap: 32,
        backgroundColor: Colors.background,
    },

    content: {
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

    sectionContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingBottom: 16,
    },

    featuredCard: {
        height: 560,
        overflow: "hidden",
        backgroundColor: Colors.surface,
        position: "relative",
    },

    featuredCardImage: {
        ...StyleSheet.absoluteFill,
    },

    featuredCardOverlay: {
        ...StyleSheet.absoluteFill,
    },

    featuredCardContent: {
        flex: 1,
        justifyContent: "flex-end",
        gap: 4,
        padding: 16,
        paddingBottom: 32,
    },

    featuredCardBadge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    featuredCardBadgeText: {
        textTransform: "uppercase",
        fontSize: 12,
        letterSpacing: 1,
        fontFamily: "DMSans-Bold",
    },

    featuredCardTitle: {
        fontSize: 28,
        fontFamily: "BricolageGrotesque-SemiBold",
    },

    featuredCardDescription: {
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        marginBottom: 12,
    },

    featuredCardButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: Colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        alignSelf: "flex-start",
    },

    featuredCardButtonText: {
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
        color: Colors.text,
    },

    imageCard: {
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    imageCardPressed: {
        filter: "brightness(0.95)",
    },

    imageCardImage: {
        width: "100%",
        height: 240,
    },

    imageCardContent: {
        padding: 16,
        gap: 8,
    },

    imageCardTitle: {
        fontSize: 20,
        lineHeight: 20,
        letterSpacing: -0.5,
        color: Colors.text,
        fontFamily: "BricolageGrotesque-SemiBold",
    },

    imageCardDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontFamily: "DMSans-Medium",
    },

    section: {
        // padding: 16,
    },

    sectionTitle: {
        fontSize: 32,
        letterSpacing: -0.5,
        color: Colors.text,
        fontFamily: "BricolageGrotesque-SemiBold",
        paddingHorizontal: 16,
        marginTop: 16,
    },

    sectionContent: {
        // gap: 10,
    },

    trendingList: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
    },

    trendingCard: {
        width: 280,
        height: 280,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: Colors.surfaceMuted,
        position: "relative",
    },

    trendingImage: {
        ...StyleSheet.absoluteFill,
    },

    trendingGradient: {
        height: "50%",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },

    trendingContent: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 16,
    },

    trendingTitle: {
        fontFamily: "BricolageGrotesque-SemiBold",
        color: "#fff",
        fontSize: 20,
        marginBottom: 6,
    },

    trendingDescription: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 14,
        lineHeight: 20,
    },
});
