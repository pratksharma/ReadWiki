import { parseArticle } from "@/services/articleParser";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFullArticle } from "../../services/wikipedia";

const Article = () => {
    const insets = useSafeAreaInsets();
    const { article } = useLocalSearchParams();

    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (article) {
            loadArticle();
        }
    }, [article]);

    const loadArticle = async () => {
        try {
            const articleHtml = await getFullArticle(article as string);

            const parsedArticle = parseArticle(articleHtml as string);

            setContent(parsedArticle);
        } catch (error) {
            console.log("ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.content}
                renderItem={({ item }) => {
                    switch (item.type) {
                        case "heading":
                            return (
                                <Text style={styles.heading}>{item.text}</Text>
                            );

                        case "paragraph":
                            return (
                                <Text style={styles.paragraph}>
                                    {item.text}
                                </Text>
                            );

                        case "image":
                            return (
                                <Image
                                    source={{ uri: item.src }}
                                    style={styles.image}
                                    contentFit="cover"
                                />
                            );

                        default:
                            return null;
                    }
                }}
            />
        </View>
    );
};

export default Article;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    content: {
        paddingTop: 100,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    heading: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 24,
        marginBottom: 12,
    },

    paragraph: {
        fontSize: 16,
        lineHeight: 28,
        marginBottom: 16,
    },

    image: {
        width: "100%",
        height: 240,
        borderRadius: 16,
        marginVertical: 16,
    },
});
