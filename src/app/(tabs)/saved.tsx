import ArticleCard from "@/components/ArticleCard";
import { useScreenScroll } from "@/components/HeaderScroll";
import Colors from "@/constants/Colors";
import { removeArticle, useSavedArticles } from "@/services/savedArticles";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import RemixIcon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Saved = () => {
    const savedArticles = useSavedArticles();
    const onScroll = useScreenScroll();

    const insets = useSafeAreaInsets();

    if (savedArticles.length === 0) {
        return (
            <View style={styles.empty}>
                <RemixIcon
                    name="bookmark-line"
                    size={48}
                    color={Colors.textMuted}
                    fallback={null}
                />
                <Text style={styles.emptyTitle}>No saved articles yet</Text>
                <Text style={styles.emptySubtitle}>
                    Tap the bookmark icon while reading an article to save it
                    here for later.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={savedArticles}
                keyExtractor={(item) => item.title}
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingBottom: insets.bottom + 80,
                    },
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <ArticleCard
                        title={item.title}
                        subtitle={item.description}
                        image={item.thumbnail}
                        onPress={() =>
                            router.push({
                                pathname: "/article/[article]",
                                params: { article: item.title },
                            })
                        }
                        onRemove={() => removeArticle(item.title)}
                    />
                )}
            />
        </View>
    );
};

export default Saved;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        paddingTop: 100,
    },

    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        backgroundColor: Colors.background,
    },

    emptyTitle: {
        marginTop: 16,
        fontSize: 20,
        fontFamily: "Fraunces-SemiBold",
        color: Colors.text,
    },

    emptySubtitle: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 14,
        lineHeight: 22,
        fontFamily: "DMSans-Regular",
        color: Colors.textMuted,
    },
});
