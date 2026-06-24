import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type ArticleCardProps = {
    title: string;
    subtitle?: string;
    image?: string;
    tag?: string;
    onPress: () => void;
};

export default function ArticleCard({
    title,
    subtitle,
    image,
    tag,
    onPress,
}: ArticleCardProps) {
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
                <View style={styles.fallbackImageIcon}>
                    <RemixIcon
                        name="file-list-2-line"
                        size={24}
                        color={Colors.textMuted}
                        fallback={null}
                    />
                </View>
            )}

            <View style={styles.content}>
                {tag && <Text style={styles.tag}>{tag}</Text>}

                <Text style={styles.title}>{title}</Text>

                {!!subtitle && (
                    <Text style={styles.subtitle} numberOfLines={2}>
                        {subtitle}
                    </Text>
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
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        padding: 12,
    },

    cardPressed: {
        filter: "brightness(0.95)",
    },

    thumbnail: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: Colors.background,
    },

    fallbackImageIcon: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
    },

    tag: {
        fontSize: 12,
        color: Colors.textSecondary,
        backgroundColor: Colors.background,
        fontFamily: "DMSans-SemiBold",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: 8,
    },

    title: {
        color: Colors.text,
        fontSize: 18,
        lineHeight: 18,
        fontFamily: "BricolageGrotesque-SemiBold",
    },

    subtitle: {
        marginTop: 4,
        color: Colors.textMuted,
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
});
