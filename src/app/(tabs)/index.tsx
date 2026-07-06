import ArticleCard from "@/components/ArticleCard";
import { useSolidHeader } from "@/components/HeaderScroll";
import Loader from "@/components/Loader";
import OnThisDayEvent from "@/components/OnThisDayEvent";
import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/Colors";
import { getFeaturedArticle } from "@/services/wikipedia";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        : Colors.textInverse;

    const insets = useSafeAreaInsets();

    // The home screen leads with a full-bleed featured image, so keep the header
    // in its scrolled state (white logo + gradient + light status bar) always.
    useSolidHeader();

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <Loader />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[
                        styles.sectionContainer,
                        {
                            paddingBottom: insets.bottom + 80,
                        },
                    ]}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                >
                    <View style={styles.featuredCard}>
                        <Image
                            source={
                                featuredArticle?.thumbnail?.source
                                    ? featuredArticle.thumbnail.source
                                    : require("../../../assets/gradient-background.jpg")
                            }
                            style={styles.featuredCardImage}
                            contentFit="cover"
                        />
                        <View style={styles.featuredCardOverlay} />

                        <LinearGradient
                            colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        />

                        <View style={styles.featuredCardContent}>
                            <View style={styles.featuredCardBadge}>
                                <Text style={styles.featuredCardBadgeText}>
                                    Featured Article
                                </Text>
                            </View>

                            <Text
                                style={styles.featuredCardTitle}
                                numberOfLines={2}
                            >
                                {featuredArticle?.normalizedtitle ??
                                    featuredArticle?.titles.normalized}
                            </Text>

                            {!!featuredArticle?.extract && (
                                <Text
                                    style={styles.featuredCardDescription}
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
                                    theme="light"
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
                                    pressed && styles.cardPressed,
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

                                <LinearGradient
                                    colors={["transparent", "rgba(0,0,0,0.9)"]}
                                    locations={[0.25, 1]}
                                    style={styles.overlayGradient}
                                />

                                <View style={styles.imageCardContent}>
                                    {!!imageOfTheDay.description?.text && (
                                        <Text
                                            style={styles.imageCardCaption}
                                            numberOfLines={3}
                                        >
                                            {imageOfTheDay.description.text}
                                        </Text>
                                    )}

                                    {!!imageOfTheDay.artist?.text && (
                                        <View style={styles.imageCardByline}>
                                            <RemixIcon
                                                name="camera-3-line"
                                                size={14}
                                                color="rgba(255,255,255,0.85)"
                                                fallback={null}
                                            />
                                            <Text
                                                style={styles.imageCardAuthor}
                                                numberOfLines={1}
                                            >
                                                {imageOfTheDay.artist.text}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        </View>
                    )}
                    {trendingArticles.length > 0 && (
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    Trending
                                </Text>
                            </View>
                            <View style={styles.sectionContent}>
                                {trendingArticles.map(
                                    (item: any, index: number) => (
                                        <ArticleCard
                                            key={item.titles.normalized + index}
                                            tag={`${item.views.toLocaleString()} views`}
                                            title={item.titles.normalized}
                                            subtitle={item.extract}
                                            image={item.thumbnail?.source}
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
                                        />
                                    ),
                                )}
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
                    {onThisDayArticles.length > 0 && (
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

                                        return (
                                            <OnThisDayEvent
                                                key={`${item.year}-${index}`}
                                                year={item.year}
                                                text={item.text}
                                                title={article?.normalizedtitle}
                                                image={
                                                    article?.thumbnail?.source
                                                }
                                                isFirst={index === 0}
                                                isLast={
                                                    index ===
                                                    onThisDayArticles.length - 1
                                                }
                                                onPress={() =>
                                                    article &&
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
                                    text={`More On This Day`}
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
        color: Colors.textInverse,
    },

    featuredCardTitle: {
        fontSize: 28,
        fontFamily: "Fraunces-SemiBold",
        color: Colors.textInverse,
    },

    featuredCardDescription: {
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        marginBottom: 12,
        color: "rgba(255,255,255,0.8)",
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
        marginHorizontal: 16,
        height: 300,
    },

    cardPressed: {
        filter: "brightness(0.90)",
    },

    imageCardImage: {
        width: "100%",
        height: "100%",
        ...StyleSheet.absoluteFill,
    },

    imageCardContent: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 16,
        gap: 10,
    },

    imageCardCaption: {
        fontSize: 18,
        lineHeight: 24,
        color: Colors.textInverse,
        fontFamily: "Fraunces-SemiBold",
    },

    imageCardByline: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    imageCardAuthor: {
        flex: 1,
        fontSize: 13,
        fontFamily: "DMSans-Medium",
        color: "rgba(255,255,255,0.85)",
    },

    section: {
        // padding: 16,
    },

    sectionTitle: {
        fontSize: 28,
        color: Colors.text,
        fontFamily: "Fraunces-SemiBold",
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },

    sectionContent: {
        // gap: 10,
    },
    overlayGradient: {
        height: "50%",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
});
