import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
        <Pressable style={styles.card} onPress={onPress}>
            {image && (
                <Image
                    source={image}
                    style={styles.thumbnail}
                    contentFit="cover"
                />
            )}

            <View style={styles.content}>
                {rank && <Text style={styles.rank}>#{rank}</Text>}

                <Text
                    style={[styles.title, !rank && { marginTop: -8 }]}
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
        alignItems: "center",
        gap: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
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

    thumbnail: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: Colors.surfaceHover,
        alignSelf: "flex-start",
    },

    content: {
        flex: 1,
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
