import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { getFeaturedArticle } from "@/services/wikipedia";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

const OnThisDay = () => {
    const [loading, setLoading] = useState(true);
    const [onThisDayArticles, setOnThisDayArticles] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getFeaturedArticle();
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
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title={"On This Day"} />
            <FlatList
                data={onThisDayArticles}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
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
                keyExtractor={(item) => item.text || item.pages?.[0].title}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default OnThisDay;

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
        paddingTop: 100,
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
