import Colors from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import RemixIcon, { type IconName } from "react-native-remix-icon";
import Animated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type CrossfadeIconProps = {
    name: IconName;
    size: number;
    // 0 = black icon (top of screen), 1 = white icon (scrolled).
    progress: SharedValue<number>;
};

// RemixIcon's colour isn't animatable, so we overlay a black and a white copy
// and crossfade their opacity as the header transitions.
const CrossfadeIcon = ({ name, size, progress }: CrossfadeIconProps) => {
    const blackStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
    }));

    const whiteStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <View style={{ width: size, height: size }}>
            <Animated.View style={[StyleSheet.absoluteFill, blackStyle]}>
                <RemixIcon
                    name={name}
                    size={size}
                    color={Colors.text}
                    fallback={null}
                />
            </Animated.View>

            <Animated.View style={[StyleSheet.absoluteFill, whiteStyle]}>
                <RemixIcon
                    name={name}
                    size={size}
                    color={Colors.textInverse}
                    fallback={null}
                />
            </Animated.View>
        </View>
    );
};

export default CrossfadeIcon;
