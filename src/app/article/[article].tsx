import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { getFullArticle } from "../../services/wikipedia";

const Article = () => {
    const { article } = useLocalSearchParams();

    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (article) {
            loadArticle();
        }
    }, [article]);

    const loadArticle = async () => {
        try {
            const articleHtml = await getFullArticle(article as string);

            const wrappedHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                    />

                    <style>
                        body {
                            padding: 16px;
                            margin: 0;
                            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                            background: #ffffff;
                            color: #222;
                            line-height: 1.7;
                        }

                        img {
                            max-width: 100%;
                            height: auto;
                            border-radius: 12px;
                        }

                        figure {
                            margin: 16px 0;
                        }

                        table {
                            display: block;
                            overflow-x: auto;
                            width: 100%;
                        }

                        a {
                            color: #2563eb;
                            text-decoration: none;
                        }

                        .mw-editsection,
                        .reference,
                        .reflist {
                            display: none !important;
                        }
                    </style>
                </head>

                <body>
                    ${articleHtml}
                </body>
                </html>
            `;

            setHtml(wrappedHtml);
        } catch (error) {
            console.log(error);
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
        <WebView
            source={{ html }}
            originWhitelist={["*"]}
            style={styles.webview}
            startInLoadingState
        />
    );
};

export default Article;

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    webview: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
