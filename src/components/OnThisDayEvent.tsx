import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type OnThisDayEventProps = {
    year: string | number;
    text: string;
    title?: string;
    image?: string;
    // Timeline flags so the connecting line stops at the first/last event.
    isFirst?: boolean;
    isLast?: boolean;
    onPress?: () => void;
};

export default function OnThisDayEvent({
    year,
    text,
    title,
    image,
    isFirst,
    isLast,
    onPress,
}: OnThisDayEventProps) {
    return (
        <View style={[styles.row, isFirst && { marginTop: 12 }]}>
            <View style={styles.timeline}>
                {!isFirst && <View style={styles.lineTop} />}
                <View style={styles.dot} />
                {!isLast && <View style={styles.lineBottom} />}
            </View>

            <View
                style={[
                    styles.content,
                    isLast
                        ? {
                              paddingBottom: 0,
                          }
                        : {
                              paddingBottom: 28,
                          },
                ]}
            >
                <Text style={styles.year}>{year}</Text>
                <Text style={styles.text}>{text}</Text>

                {!!title && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.articleChip,
                            pressed && styles.articleChipPressed,
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
                                    name="file-list-2-line"
                                    size={18}
                                    color={Colors.textMuted}
                                    fallback={null}
                                />
                            </View>
                        )}

                        <Text style={styles.articleTitle} numberOfLines={1}>
                            {title}
                        </Text>

                        <RemixIcon
                            name="arrow-right-line"
                            size={18}
                            color={Colors.textSecondary}
                            fallback={null}
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const DOT_SIZE = 12;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        paddingHorizontal: 16,
    },

    timeline: {
        width: 24,
        alignItems: "center",
    },

    lineTop: {
        width: 2,
        height: 8,
        backgroundColor: Colors.border,
    },

    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: Colors.primary,
    },

    lineBottom: {
        flex: 1,
        width: 2,
        backgroundColor: Colors.border,
    },

    content: {
        flex: 1,
        paddingLeft: 12,
    },

    year: {
        fontSize: 20,
        color: Colors.text,
        fontFamily: "Fraunces-SemiBold",
        lineHeight: 22,
    },

    text: {
        marginTop: 4,
        color: Colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        fontFamily: "DMSans-Medium",
    },

    articleChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 12,
        padding: 8,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    articleChipPressed: {
        filter: "brightness(0.95)",
    },

    thumbnail: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },

    thumbnailFallback: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: Colors.surfaceMuted,
        alignItems: "center",
        justifyContent: "center",
    },

    articleTitle: {
        flex: 1,
        color: Colors.text,
        fontSize: 14,
        fontFamily: "DMSans-SemiBold",
    },
});
