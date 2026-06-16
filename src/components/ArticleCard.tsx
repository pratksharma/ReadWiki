import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type ArticleCardProps = {
    title: string;
    subtitle?: string;
    image?: string;
    rank?: number;
    onPress: () => void;
};

export default function ArticleCard({
    title,
    subtitle,
    image,
    rank,
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
                {rank && <Text style={styles.rank}>#{rank}</Text>}

                <Text
                    style={[styles.title, !rank && { marginTop: -6 }]}
                    numberOfLines={2}
                >
                    {title}
                </Text>

                {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        position: "relative",
        flexDirection: "row",
        gap: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
    },

    cardPressed: {
        backgroundColor: Colors.surfaceHover,
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

    rank: {
        fontSize: 12,
        color: Colors.primary,
        backgroundColor: Colors.background,
        fontFamily: "DMSans-SemiBold",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignSelf: "flex-start",
    },

    title: {
        color: Colors.text,
        fontSize: 18,
        fontFamily: "BricolageGrotesque-SemiBold",
    },

    subtitle: {
        marginTop: 4,
        color: Colors.textSecondary,
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
});
