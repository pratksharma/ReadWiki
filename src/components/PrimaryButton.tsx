import Colors from "@/constants/Colors";
import { Pressable, StyleSheet, Text } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface PrimaryButtonProps {
    text: string;
    iconName: string;
    iconPosition?: "left" | "right";
    theme?: "light" | "dark";
    onPress: () => void;
}

const PrimaryButton = ({
    text,
    iconName,
    iconPosition = "right",
    theme = "light",
    onPress,
}: PrimaryButtonProps) => {
    const isDark = theme === "dark";

    const backgroundColor = isDark ? Colors.primary : Colors.surface;
    const pressedColor = isDark ? Colors.secondary : Colors.surfaceHover;
    const textColor = isDark ? Colors.textInverse : Colors.text;

    const icon = (
        <RemixIcon
            name={iconName as any}
            size={16}
            color={textColor}
            fallback={null}
        />
    );

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: backgroundColor,
                },
                pressed && styles.buttonPressed,
            ]}
            onPress={onPress}
        >
            {iconPosition === "left" && icon}

            <Text style={[styles.buttonText, { color: textColor }]}>
                {text}
            </Text>

            {iconPosition === "right" && icon}
        </Pressable>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    buttonPressed: {
        filter: "brightness(0.9)",
        transform: [{ scale: 0.98 }],
    },

    buttonText: {
        fontFamily: "BricolageGrotesque-SemiBold",
        fontSize: 14,
    },
});
