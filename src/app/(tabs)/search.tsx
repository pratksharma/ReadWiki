import { searchArticles } from "@/services/wikipedia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const Search = () => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSearchResults = async () => {
        if (!query.trim()) return;

        try {
            setLoading(true);

            const data = await searchArticles(query);

            const sortedData = [...data].sort((a, b) => a.index - b.index);

            setSearchResults(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Search</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search Wikipedia..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                    returnKeyType="search"
                    onSubmitEditing={loadSearchResults}
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.searchButton,
                        pressed && { opacity: 0.8 },
                    ]}
                    onPress={loadSearchResults}
                >
                    <RemixIcon
                        name="search-2-fill"
                        size={24}
                        color="#ffffff"
                        fallback={null}
                    />
                </Pressable>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.title}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Search for any Wikipedia article
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [
                                styles.card,
                                pressed && styles.cardPressed,
                            ]}
                            onPress={() =>
                                router.push({
                                    pathname: "/article/[article]",
                                    params: {
                                        article: item.title,
                                    },
                                })
                            }
                        >
                            <View style={styles.content}>
                                <View style={styles.textContainer}>
                                    <Text
                                        style={styles.title}
                                        numberOfLines={2}
                                    >
                                        {item.title}
                                    </Text>

                                    {item.description && (
                                        <Text
                                            style={styles.description}
                                            numberOfLines={2}
                                        >
                                            {item.description}
                                        </Text>
                                    )}
                                </View>

                                {item.thumbnail?.source && (
                                    <Image
                                        source={{
                                            uri: item.thumbnail.source,
                                        }}
                                        style={styles.thumbnail}
                                        contentFit="cover"
                                    />
                                )}
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
        paddingTop: 70,
    },

    heading: {
        fontSize: 32,
        fontWeight: "700",
        color: "#111827",
        marginHorizontal: 20,
        marginBottom: 20,
    },

    searchContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },

    searchInput: {
        flex: 1,
        height: 52,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,

        elevation: 2,
    },

    searchButton: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexGrow: 1,
        gap: 12,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        fontSize: 16,
        color: "#6B7280",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
    },

    cardPressed: {
        opacity: 0.8,
    },

    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },

    textContainer: {
        flex: 1,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },

    description: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
    },

    thumbnail: {
        width: 56,
        height: 56,
        borderRadius: 10,
        backgroundColor: "#E5E7EB",
    },
});
