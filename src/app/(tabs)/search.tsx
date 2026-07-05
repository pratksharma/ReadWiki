import ArticleCard from "@/components/ArticleCard";
import { useStaticHeader } from "@/components/HeaderScroll";
import Colors from "@/constants/Colors";
import { searchArticles } from "@/services/wikipedia";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Search = () => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSearchResults = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);

            const data = await searchArticles(searchQuery);

            const sortedData = [...data].sort((a, b) => a.index - b.index);

            setSearchResults(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        const timeout = setTimeout(() => {
            loadSearchResults(trimmedQuery);
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    const clearSearch = () => {
        setQuery("");
        setSearchResults([]);
    };

    const inputRef = useRef<TextInput>(null);
    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            return () => clearTimeout(timer);
        }, []),
    );

    const insets = useSafeAreaInsets();

    // The results list sits below a fixed search bar, so nothing scrolls under
    // the header — keep it in its default (black, no gradient) state.
    useStaticHeader();

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.inputWrapper}>
                    <RemixIcon
                        name="search-2-line"
                        size={20}
                        color={Colors.textMuted}
                        style={styles.leftIcon}
                        fallback={null}
                    />

                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search articles..."
                        placeholderTextColor={Colors.textMuted}
                        style={styles.searchInput}
                        returnKeyType="search"
                        ref={inputRef}
                    />

                    {query.length > 0 && (
                        <Pressable
                            onPress={clearSearch}
                            style={styles.clearButton}
                        >
                            <RemixIcon
                                name="close-line"
                                size={20}
                                color={Colors.textMuted}
                                fallback={null}
                            />
                        </Pressable>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.title}
                    contentContainerStyle={[
                        styles.listContent,
                        {
                            paddingBottom: insets.bottom + 80,
                        },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            Search for any Wikipedia article
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <ArticleCard
                            title={item.title}
                            subtitle={item.description}
                            image={item.thumbnail?.source}
                            onPress={() =>
                                router.push({
                                    pathname: "/article/[article]",
                                    params: {
                                        article: item.title,
                                    },
                                })
                            }
                        />
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
        backgroundColor: Colors.background,
        paddingTop: 100,
    },

    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },

    inputWrapper: {
        position: "relative",
        justifyContent: "center",
    },

    searchInput: {
        backgroundColor: Colors.surface,
        borderRadius: 100,
        paddingLeft: 44,
        paddingRight: 44,
        fontSize: 16,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        fontFamily: "DMSans-Medium",
    },

    leftIcon: {
        position: "absolute",
        left: 12,
        zIndex: 1,
    },

    clearButton: {
        position: "absolute",
        right: 12,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loaderContainer: {
        flex: 1,
        alignItems: "center",
    },

    listContent: {
        flexGrow: 1,
    },

    emptyText: {
        alignSelf: "center",
        textAlign: "center",
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.textMuted,
        fontFamily: "DMSans-Medium",
    },
});
