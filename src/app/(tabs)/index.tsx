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
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

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
                        <View style={styles.featuredCard}>
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
                                        numberOfLines={2}
                                    >
                                        {featuredArticle.description == ""
                                            ? featuredArticle.extract
                                            : featuredArticle.description}
                                    </Text>
                                )}
                                <View style={{ alignItems: "flex-start" }}>
                                    <PrimaryButton
                                        text="Read More"
                                        iconName="arrow-right-line"
                                        theme={
                                            featuredArticle?.thumbnail
                                                ? "light"
                                                : "dark"
                                        }
                                        onPress={() =>
                                            router.push({
                                                pathname: "/article/[article]",
                                                params: {
                                                    article:
                                                        featuredArticle?.title,
                                                },
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                        {imageOfTheDay && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    Image of the Day
                                </Text>

                                <Pressable
                                    style={styles.imageCard}
                                    onPress={() => {
                                        router.navigate({
                                            pathname: "/image/[image]",
                                            params: {
                                                image: imageOfTheDay.image
                                                    .source,
                                                title: imageOfTheDay.title.replace(
                                                    /^(File:|\s*)|(\.(jpg|png)$)/gi,
                                                    "",
                                                ),
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
                                                style={
                                                    styles.imageCardDescription
                                                }
                                            >
                                                {imageOfTheDay.description.text}
                                            </Text>
                                        )}
                                    </View>
                                </Pressable>
                            </>
                        )}
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
                renderSectionFooter={({ section }) => (
                    <Pressable
                        onPress={() => router.navigate(section.slug as any)}
                        style={({ pressed }) => [
                            styles.sectionButton,
                            pressed && styles.sectionButtonPressed,
                        ]}
                    >
                        <Text style={styles.sectionButtonText}>
                            More Articles
                        </Text>
                        <RemixIcon
                            name="arrow-right-long-fill"
                            color={Colors.textInverse}
                            size={20}
                            fallback={null}
                        />
                    </Pressable>
                )}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
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

    featuredCard: {
        height: 520,
        overflow: "hidden",
        backgroundColor: Colors.surface,
        position: "relative",
    },

    featuredCardImage: {
        ...StyleSheet.absoluteFill,
    },

    featuredCardOverlay: {
        ...StyleSheet.absoluteFill,
        // backgroundColor: "rgba(0,0,0,0.55)",
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
        lineHeight: 32,
        fontFamily: "BricolageGrotesque-SemiBold",
    },

    featuredCardDescription: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: "DMSans-Medium",
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
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
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
        fontSize: 24,
        lineHeight: 26,
        color: Colors.text,
        fontFamily: "BricolageGrotesque-SemiBold",
    },

    imageCardDescription: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontFamily: "DMSans-Medium",
    },

    sectionTitle: {
        marginHorizontal: 16,
        fontSize: 32,
        letterSpacing: -0.5,
        color: Colors.text,
        fontFamily: "BricolageGrotesque-SemiBold",
        marginTop: 32,
        marginBottom: 8,
    },

    sectionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: Colors.secondary,
        alignSelf: "center",
    },
    sectionButtonPressed: {
        opacity: 0.9,
    },

    sectionButtonText: {
        fontSize: 16,
        fontFamily: "DMSans-Medium",
        color: Colors.textInverse,
    },
});
