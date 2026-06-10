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
import { getFeaturedArticle } from "../../services/wikipedia";

const Home = () => {
    const [featuredArticle, setFeaturedArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadArticle = async () => {
        try {
            const data = await getFeaturedArticle();
            setFeaturedArticle(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticle();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                    Loading featured article...
                </Text>
            </View>
        );
    }

    const article = featuredArticle?.tfa;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="dark-content" />

            <Text style={styles.logo}>WikiAtlas</Text>
            <Text style={styles.sectionTitle}>Today's Featured Article</Text>

            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                ]}
                onPress={() => {
                    console.log(
                        "Open article:",
                        article?.normalizedtitle ?? article?.title,
                    );

                    // Navigate to article screen here
                    router.push({
                        pathname: "/article/[article]",
                        params: {
                            article: article?.title,
                        },
                    });
                }}
            >
                {article?.thumbnail?.source && (
                    <Image
                        source={article?.thumbnail?.source}
                        style={styles.thumbnail}
                        contentFit="cover"
                    />
                )}

                <View style={styles.cardContent}>
                    {/* <Text style={styles.badge}>FEATURED ARTICLE</Text> */}

                    <Text style={styles.title}>
                        {article?.normalizedtitle ?? article?.title}
                    </Text>

                    {article?.description && (
                        <Text style={styles.description}>
                            {article.description}
                        </Text>
                    )}

                    <Text style={styles.extract} numberOfLines={3}>
                        {article?.extract}
                    </Text>

                    <View style={styles.readMore}>
                        <Text style={styles.readMoreText}>Tap to read</Text>
                        <RemixIcon
                            name="arrow-right-s-line"
                            size={24}
                            color="#111827"
                        />
                    </View>
                </View>
            </Pressable>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
    },

    content: {
        paddingTop: 70,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FB",
    },

    loadingText: {
        marginTop: 12,
        color: "#666",
        fontSize: 14,
    },

    logo: {
        fontSize: 34,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 28,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 14,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,

        elevation: 4,
    },

    cardPressed: {
        filter: "brightness(0.95)",
    },

    thumbnail: {
        width: "100%",
        height: 220,
        backgroundColor: "#E5E7EB",
    },

    cardContent: {
        padding: 18,
    },

    badge: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2563EB",
        letterSpacing: 1,
        marginBottom: 10,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
        lineHeight: 32,
    },

    description: {
        marginTop: 8,
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 22,
    },

    extract: {
        marginTop: 12,
        fontSize: 15,
        color: "#6B7280",
        lineHeight: 24,
    },

    readMore: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
    },
    readMoreText: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "600",
        color: "#111827",
    },
});
