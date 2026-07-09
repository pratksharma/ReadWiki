import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type NewsCardProps = {
    // Plain-text summary of the news story (HTML already stripped).
    story: string;
    // The primary related article the card links to.
    title?: string;
    image?: string;
    onPress?: () => void;
};

export default function NewsCard({
    story,
    title,
    image,
    onPress,
}: NewsCardProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={onPress}
        >
            {image ? (
                <Image
                    source={image}
                    style={styles.thumbnail}
                    contentFit="cover"
                />
            ) : (
                <View style={styles.thumbnailFallback}>
                    <RemixIcon
                        name="newspaper-line"
                        size={24}
                        color={Colors.textMuted}
                        fallback={null}
                    />
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.story} numberOfLines={3}>
                    {story}
                </Text>

                {!!title && (
                    <View style={styles.byline}>
                        <RemixIcon
                            name="arrow-right-line"
                            size={14}
                            color={Colors.textSecondary}
                            fallback={null}
                        />
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "relative",
        flexDirection: "row",
        gap: 12,
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    cardPressed: {
        filter: "brightness(0.95)",
    },

    thumbnail: {
        width: 72,
        height: 72,
        borderRadius: 8,
    },

    thumbnailFallback: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: Colors.backgroundMuted,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
        justifyContent: "center",
    },

    story: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 21,
        fontFamily: "DMSans-SemiBold",
    },

    byline: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 6,
    },

    title: {
        flex: 1,
        color: Colors.textSecondary,
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
});
