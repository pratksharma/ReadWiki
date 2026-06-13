import ArticleCard from "@/components/ArticleCard";
import Colors from "@/constants/Colors";
import { getFeaturedArticle } from "@/services/wikipedia";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Trending = () => {
    const inset = useSafeAreaInsets();

    const [loading, setLoading] = useState(true);
    const [trendingArticles, setTrendingArticles] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getFeaturedArticle();
            setTrendingArticles(data.mostread?.articles || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: inset.top,
                },
            ]}
        >
            <FlatList
                data={trendingArticles}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>Trending</Text>
                        <Text style={styles.subtitle}>
                            Most read articles on Wikipedia today
                        </Text>
                    </View>
                }
                renderItem={({ item, index }) => (
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
                )}
                keyExtractor={(item) =>
                    item.id?.toString() || item.titles.normalized
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Trending;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingBottom: 24,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        color: Colors.text,
        fontFamily: "DMSans-Bold",
        letterSpacing: -1,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontFamily: "DMSans-Medium",
    },
});
