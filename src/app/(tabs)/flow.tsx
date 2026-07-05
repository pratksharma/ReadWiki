import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import PrimaryButton from "@/components/PrimaryButton";
import { useSolidHeader } from "@/components/HeaderScroll";
import { getRandomArticles } from "@/services/wikipedia";

const { height } = Dimensions.get("window");

const BATCH_SIZE = 20;

const Flow = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Flow is a full-screen dark pager, so keep the header in its white state.
    useSolidHeader();

    const preloadImages = async (items: any[]) => {
        const urls = items
            .map((item) => item.thumbnail?.source)
            .filter(Boolean);

        if (urls.length) {
            await Image.prefetch(urls);
        }
    };

    const loadInitial = async () => {
        try {
            const data = await getRandomArticles(BATCH_SIZE);
            await preloadImages(data);
            setArticles(data);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore) return;

        setLoadingMore(true);

        try {
            const more = await getRandomArticles(BATCH_SIZE);
            await preloadImages(more);
            setArticles((prev) => [...prev, ...more]);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        loadInitial();
    }, []);

    const renderItem = useCallback(({ item }: any) => {
        const thumbnail = item.thumbnail?.source;

        const aspectRatio =
            item.thumbnail?.width && item.thumbnail?.height
                ? item.thumbnail.width / item.thumbnail.height
                : 1;

        return (
            <View style={styles.page}>
                <Image
                    source={
                        thumbnail
                            ? thumbnail
                            : require("../../../assets/gradient-background.jpg")
                    }
                    style={styles.background}
                    contentFit="cover"
                    blurRadius={30}
                />
                <View style={styles.overlay} />

                <View style={styles.content}>
                    {thumbnail && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: thumbnail }}
                                contentFit="contain"
                                style={[
                                    styles.thumbnail,
                                    {
                                        aspectRatio,
                                    },
                                ]}
                                transition={200}
                            />
                        </View>
                    )}

                    <Text style={styles.title} numberOfLines={3}>
                        {item.title}
                    </Text>

                    <Text style={styles.extract} numberOfLines={4}>
                        {item.extract}
                    </Text>

                    <View style={{ alignItems: "flex-start" }}>
                        <PrimaryButton
                            text="Read More"
                            iconName="arrow-right-long-fill"
                            onPress={() =>
                                router.push({
                                    pathname: "/article/[article]",
                                    params: {
                                        article: item.title,
                                    },
                                })
                            }
                        />
                    </View>
                </View>
            </View>
        );
    }, []);

    if (loading) {
        return (
            <View style={styles.loading}>
                <Image
                    source={require("../../../assets/gradient-background.jpg")}
                    style={styles.background}
                    contentFit="cover"
                    transition={200}
                    blurRadius={30}
                />
                <View style={styles.overlay} />
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <FlatList
            data={articles}
            renderItem={renderItem}
            keyExtractor={(item) => item.pageid.toString()}
            pagingEnabled
            decelerationRate="fast"
            snapToAlignment="start"
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={3}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews
            getItemLayout={(_, index) => ({
                length: height,
                offset: height * index,
                index,
            })}
            ListFooterComponent={
                loadingMore ? (
                    <View style={styles.loading}>
                        <Image
                            source={require("../../../assets/gradient-background.jpg")}
                            style={styles.background}
                            contentFit="cover"
                            transition={200}
                            blurRadius={30}
                        />
                        <View style={styles.overlay} />
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : null
            }
        />
    );
};

export default Flow;

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        height,
        justifyContent: "center",
        alignItems: "center",
    },

    page: {
        flex: 1,
        height,
        justifyContent: "center",
    },

    background: {
        ...StyleSheet.absoluteFill,
    },

    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,.55)",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    imageContainer: {
        width: "100%",
        maxHeight: 280,
        marginBottom: 16,
    },

    thumbnail: {
        width: "100%",
        maxHeight: 280,
        borderRadius: 16,
    },

    title: {
        color: "#fff",
        fontSize: 24,
        fontFamily: "Fraunces-SemiBold",
    },

    extract: {
        marginTop: 16,
        marginBottom: 22,
        color: "rgba(255,255,255,0.9)",
        fontSize: 14,
        fontFamily: "DMSans-Medium",
    },
});
