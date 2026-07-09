import Colors from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type DidYouKnowCardProps = {
    text: string;
};

export default function DidYouKnowCard({ text }: DidYouKnowCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <RemixIcon
                    name="lightbulb-line"
                    size={18}
                    color={Colors.accent}
                    fallback={null}
                />
            </View>

            <Text style={styles.fact}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        marginTop: 12,
        marginHorizontal: 16,
    },

    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.backgroundMuted,
        marginRight: 12,
    },

    fact: {
        flexShrink: 1,
        fontSize: 15,
        lineHeight: 28,
        fontFamily: "DMSans-Medium",
        color: Colors.textSecondary,
    },
});
