import { useScreenScroll } from "@/components/HeaderScroll";
import Loader from "@/components/Loader";
import OnThisDayEvent from "@/components/OnThisDayEvent";
import Colors from "@/constants/Colors";
import { getFeaturedArticle } from "@/services/wikipedia";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const OnThisDay = () => {
    const [loading, setLoading] = useState(true);
    const [onThisDayArticles, setOnThisDayArticles] = useState<any[]>([]);
    const onScroll = useScreenScroll();

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
                <Loader />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={onThisDayArticles}
                contentContainerStyle={styles.listContent}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    const article = item.pages?.[0];

                    return (
                        <OnThisDayEvent
                            year={item.year}
                            text={item.text}
                            title={article?.normalizedtitle}
                            image={article?.thumbnail?.source}
                            isFirst={index === 0}
                            isLast={index === onThisDayArticles.length - 1}
                            onPress={() =>
                                article &&
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
                keyExtractor={(item, index) =>
                    `${item.text}-${index}` ||
                    `${item.pages?.[0].title}-${index}`
                }
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
});
